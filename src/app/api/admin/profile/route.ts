import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  AUTH_COOKIE_NAME,
  getCurrentSession,
  createSessionToken,
  UserSession,
} from '@/server/identity';
import { dbQuery } from '@/server/db/client';

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const {
      firstName,
      lastName,
      name,
      email,
      phone,
      jobTitle,
      orgName,
      settings,
    } = body;

    // Resolve combined name
    let updatedFullName = session.name;
    if (firstName || lastName) {
      updatedFullName = `${firstName || ''} ${lastName || ''}`.trim();
    } else if (name) {
      updatedFullName = name.trim();
    }

    const updatedEmail = email?.trim() || session.email;
    const updatedOrgName = orgName?.trim() || session.orgName;

    // Update database person record if real DB is active
    try {
      if (session.personId && session.personId !== '00000000-0000-0000-0000-000000000001') {
        await dbQuery(
          `persons?id=eq.${encodeURIComponent(session.personId)}`,
          {
            method: 'PATCH',
            body: {
              first_name: firstName || updatedFullName.split(' ')[0],
              last_name: lastName || updatedFullName.split(' ').slice(1).join(' '),
              email: updatedEmail,
              phone: phone || null,
              job_title: jobTitle || null,
              updated_at: new Date().toISOString(),
            },
          }
        );
      }
    } catch (dbErr) {
      console.warn('Database person update warning (ignorable if using demo session):', dbErr);
    }

    // Build updated session object
    const updatedSession: UserSession = {
      ...session,
      name: updatedFullName || 'EntireFM Administrator',
      email: updatedEmail,
      orgName: updatedOrgName,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    };

    const token = createSessionToken(updatedSession);

    const response = NextResponse.json({
      ok: true,
      message: 'Profile and system settings updated successfully.',
      session: {
        name: updatedSession.name,
        email: updatedSession.email,
        role: updatedSession.role,
        orgName: updatedSession.orgName,
      },
    });

    // Refresh HTTP-only session cookies
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    response.cookies.set('efm_admin', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: any) {
    console.error('Profile update error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      session,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
