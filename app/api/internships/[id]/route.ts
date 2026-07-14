import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import Internship from '@/models/Internship';
import { auth } from '@/lib/auth';

/**
 * GET /api/internships/[id]
 * Public endpoint to fetch a single internship.
 * If authenticated, dynamically calculates and returns the user's skill-match score.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;

    // Connect to database
    await dbConnect();

    // Fetch internship
    const internship = await Internship.findById(id);

    if (!internship) {
      return NextResponse.json(
        { success: false, message: 'Internship not found' },
        { status: 404 }
      );
    }

    // Try to get authenticated session to compute skill-match score
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    let matchScore: number | null = null;

    if (session && session.user && Array.isArray(session.user.skills)) {
      const userSkills = session.user.skills.map((skill: string) => skill.trim().toLowerCase());
      const requiredSkills = internship.requiredSkills.map((skill: string) => skill.trim().toLowerCase());

      if (requiredSkills.length > 0) {
        const matchedSkills = requiredSkills.filter((skill: string) =>
          userSkills.includes(skill)
        );
        matchScore = Math.round((matchedSkills.length / requiredSkills.length) * 100);
      } else {
        // If the internship has no required skills, it's a 100% match
        matchScore = 100;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        internship,
        matchScore,
      },
    });
  } catch (error: any) {
    console.error('Failed to fetch internship details:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/internships/[id]
 * Protected endpoint to delete an internship listing.
 * Checks that the authenticated user is the owner (creator) of the listing.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;

    // 1. Authenticate user session using Better Auth.
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

    // 2. Connect to database
    await dbConnect();

    // 3. Find the internship
    const internship = await Internship.findById(id);

    if (!internship) {
      return NextResponse.json(
        { success: false, message: 'Internship not found' },
        { status: 404 }
      );
    }

    // 4. Perform Authorization Check (Ownership Check with Admin Bypass)
    // internship.postedBy is Schema.Types.ObjectId, session.user.id is a string
    if (internship.postedBy.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Forbidden: You do not own this internship listing and are not an admin' },
        { status: 403 }
      );
    }

    // 5. Delete internship listing
    await Internship.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Internship listing deleted successfully',
    });
  } catch (error: any) {
    console.error('Failed to delete internship:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
