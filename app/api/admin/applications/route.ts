import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import Application from '@/models/Application';
import Internship from '@/models/Internship';
import { auth } from '@/lib/auth';
import { client } from '@/lib/mongoClient';

/**
 * GET /api/admin/applications
 * Returns all applications across the platform with populated internship and applicant details.
 * Admin role required.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Please log in first' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Connect to database
    await dbConnect();

    // Fetch all applications and populate internships
    const applications = await Application.find({})
      .populate({
        path: 'internshipId',
        model: Internship,
      })
      .sort({ createdAt: -1 });

    // Fetch user details for all applicants in batch
    const userIds = applications.map(app => app.userId);
    const db = client.db();
    const users = await db.collection('user').find({
      id: { $in: userIds }
    }).toArray();

    // Map users by their Better Auth ID
    const userMap = new Map(users.map(u => [u.id, {
      id: u.id,
      name: u.name,
      email: u.email,
      skills: u.skills || [],
    }]));

    // Combine application, internship, and applicant details
    const formattedApplications = applications.map(app => {
      const appObj = app.toObject();
      const applicant = userMap.get(app.userId) || {
        id: app.userId,
        name: 'Unknown Student',
        email: 'unknown@example.com',
        skills: [],
      };

      return {
        _id: appObj._id.toString(),
        userId: appObj.userId,
        internshipId: appObj.internshipId,
        status: appObj.status,
        appliedAt: appObj.createdAt ? appObj.createdAt.toISOString() : new Date().toISOString(),
        applicant,
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedApplications,
    });
  } catch (error: any) {
    console.error('Admin Fetch Applications Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
