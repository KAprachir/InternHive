import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import Internship from '@/models/Internship';
import { auth } from '@/lib/auth';

/**
 * GET /api/internships
 * Public endpoint to fetch, search, filter, sort, and paginate internships.
 * Supported query options:
 * - ?search=     (searches title, company, or description)
 * - ?type=       (filters by 'Remote', 'Onsite', or 'Hybrid')
 * - ?location=   (filters by location matching string)
 * - ?sort=       ('newest' | 'oldest' | 'stipend-high' | 'stipend-low')
 * - ?page=       (pagination, defaults to 1)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const location = searchParams.get('location') || '';
    const postedBy = searchParams.get('postedBy') || '';
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1', 10);

    const limit = 8; // items per page
    const skip = (page - 1) * limit;

    // Connect to database
    await dbConnect();

    // Build Mongoose query criteria
    const query: any = {};

    if (postedBy) {
      query.postedBy = postedBy;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (type) {
      query.type = type;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Determine Mongoose sort criteria
    let sortObj: any = { createdAt: -1 }; // default newest
    if (sort === 'oldest') {
      sortObj = { createdAt: 1 };
    } else if (sort === 'stipend-high') {
      sortObj = { stipend: -1 };
    } else if (sort === 'stipend-low') {
      sortObj = { stipend: 1 };
    }

    // Try to get authenticated session to compute skill-match score for listings
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Execute queries in parallel to optimize response time
    const [internships, total] = await Promise.all([
      Internship.find(query).sort(sortObj).skip(skip).limit(limit),
      Internship.countDocuments(query),
    ]);

    // Calculate matchScore for each internship listing if session is active
    const results = internships.map((internship) => {
      let matchScore: number | null = null;
      if (session && session.user && Array.isArray(session.user.skills)) {
        const userSkills = session.user.skills.map((s: string) => s.trim().toLowerCase());
        const requiredSkills = internship.requiredSkills.map((s: string) => s.trim().toLowerCase());

        if (requiredSkills.length > 0) {
          const matched = requiredSkills.filter((s: string) => userSkills.includes(s));
          matchScore = Math.round((matched.length / requiredSkills.length) * 100);
        } else {
          matchScore = 100;
        }
      }
      return {
        ...internship.toObject(),
        matchScore,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        internships: results,
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Failed to fetch internships:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/internships
 * Protected endpoint to create an internship.
 * Requires a valid Better Auth session.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Authenticate session using Better Auth.
    // In Next 15+, headers() is asynchronous, so we must await it.
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Please log in first' },
        { status: 401 }
      );
    }

    // Read and validate body data
    const body = await request.json();
    const { title, company, location, type, stipend, requiredSkills, description } = body;

    if (!title || !company || !location || !type || !description) {
      return NextResponse.json(
        { success: false, message: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Create a new internship and set postedBy to the authenticated user's ID
    const newInternship = await Internship.create({
      postedBy: session.user.id,
      title,
      company,
      location,
      type,
      stipend: stipend ? Number(stipend) : undefined,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      description,
    });

    return NextResponse.json(
      { success: true, data: newInternship },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Failed to create internship:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
