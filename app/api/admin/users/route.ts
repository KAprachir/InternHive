import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { client } from '@/lib/mongoClient';

/**
 * GET /api/admin/users
 * Returns all registered users. Admin role required.
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

    const db = client.db();
    const usersCollection = db.collection('user');

    // Retrieve all users from Better Auth user collection
    const users = await usersCollection.find({}, {
      projection: {
        id: 1,
        _id: 1,
        name: 1,
        email: 1,
        role: 1,
        skills: 1,
        createdAt: 1,
      }
    }).toArray();

    // Standardize _id to id mapping for frontend consistency
    const formattedUsers = users.map(user => ({
      id: user.id || user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || 'student',
      skills: user.skills || [],
      createdAt: user.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: formattedUsers,
    });
  } catch (error: any) {
    console.error('Admin Fetch Users Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/users
 * Updates a user's role. Admin role required.
 * Implements lockout prevention to prevent self-demotion.
 */
export async function PUT(request: NextRequest): Promise<NextResponse> {
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

    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role || (role !== 'admin' && role !== 'student')) {
      return NextResponse.json(
        { success: false, message: 'Invalid payload: userId and valid role ("admin" | "student") are required' },
        { status: 400 }
      );
    }

    // Lockout Protection: Admin cannot demote themselves to student
    if (userId === session.user.id && role === 'student') {
      return NextResponse.json(
        { success: false, message: 'Operation rejected: You cannot demote yourself from the admin role' },
        { status: 400 }
      );
    }

    const db = client.db();
    const usersCollection = db.collection('user');

    // Update by standard id or MongoDB ObjectId if applicable
    // Better Auth sets 'id' as a string field.
    const result = await usersCollection.updateOne(
      { id: userId },
      { $set: { role: role } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `User role successfully updated to ${role}`,
    });
  } catch (error: any) {
    console.error('Admin Update User Role Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
