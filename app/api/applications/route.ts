import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import Application from '@/models/Application';
// We import Internship explicitly to ensure the model is registered in Mongoose.
// Otherwise, .populate('internshipId') may fail with a "Schema hasn't been registered" error.
import Internship from '@/models/Internship';
import { auth } from '@/lib/auth';

/**
 * GET /api/applications
 * Protected endpoint. Returns all applications submitted by the logged-in user.
 * Populates details about the associated internship listing.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Authenticate user session using Better Auth.
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

    // Connect to database
    await dbConnect();

    // Fetch user applications and populate referenced internship fields
    const applications = await Application.find({ userId: session.user.id })
      .populate({
        path: 'internshipId',
        model: Internship, // explicitly pass model to prevent population registration errors
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: applications,
    });
  } catch (error: any) {
    console.error('Failed to fetch applications:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/applications
 * Protected endpoint. Allows logged-in students to apply to an internship.
 * Enforces duplicate application prevention.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Authenticate user session using Better Auth.
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
    const { internshipId } = body;

    if (!internshipId) {
      return NextResponse.json(
        { success: false, message: 'Internship ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // 1. Confirm the internship listing exists
    const internshipExists = await Internship.findById(internshipId);
    if (!internshipExists) {
      return NextResponse.json(
        { success: false, message: 'Internship listing not found' },
        { status: 404 }
      );
    }

    // 2. Prevent duplicate applications: check if an application already exists
    const existingApplication = await Application.findOne({
      userId: session.user.id,
      internshipId,
    });

    if (existingApplication) {
      return NextResponse.json(
        { success: false, message: 'You have already applied to this internship' },
        { status: 400 }
      );
    }

    // 3. Create new application (defaults to 'Applied' via Schema specification)
    const newApplication = await Application.create({
      userId: session.user.id,
      internshipId,
    });

    return NextResponse.json(
      { success: true, data: newApplication },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Failed to submit application:', error);
    
    // Catch database unique index violations (e.g. concurrency edge cases)
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'You have already applied to this internship' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
