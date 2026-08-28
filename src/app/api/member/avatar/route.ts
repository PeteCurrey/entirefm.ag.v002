import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { getMemberSessionFromRequest } from '@/server/member/member-session';
import { getMemberById, updateMemberProfile } from '@/server/member/member-store';
import { getDbConfig, isDbConfigured } from '@/server/db/client';

export const dynamic = 'force-dynamic';

// In-memory fallback avatar storage for development & testing
const MEMORY_AVATAR_STORAGE = new Map<string, { buffer: Buffer; mimeType: string; updatedAt: string }>();

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const TARGET_DIMENSION = 800; // Max 800x800px

/**
 * POST /api/member/avatar
 * Uploads, crops, optimizes, and persists a member profile photo.
 */
export async function POST(request: Request) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in as a Member.' }, { status: 401 });
  }

  const member = await getMemberById(session.memberId);
  if (!member || member.member_status === 'banned' || member.member_status === 'deleted') {
    return NextResponse.json({ error: 'Unauthorized. Member account is not active.' }, { status: 401 });
  }

  try {
    const formData = await request.formData().catch(() => null);
    if (!formData) {
      return NextResponse.json({ error: 'Invalid form data payload.' }, { status: 400 });
    }

    const file = formData.get('file') as File | null;
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No image file provided in upload.' }, { status: 400 });
    }

    // 1. Validate File Size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Image file exceeds the 10MB maximum upload limit.' },
        { status: 400 }
      );
    }

    // 2. Validate MIME Type
    const mimeType = file.type.toLowerCase();
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { error: 'Unsupported file format. Please upload a JPG, PNG, or WebP image.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // 3. Process & Optimize with Sharp (resize to max 800x800, convert to WebP, optimize)
    const optimizedBuffer = await sharp(inputBuffer)
      .resize({
        width: TARGET_DIMENSION,
        height: TARGET_DIMENSION,
        fit: 'cover',
        position: 'center',
        withoutEnlargement: true,
      })
      .webp({ quality: 88, effort: 4 })
      .toBuffer();

    const timestamp = Date.now();
    const storagePath = `${session.memberId}/avatar.webp`;
    let finalAvatarUrl: string;

    const dbConfig = getDbConfig();

    if (dbConfig) {
      // 4a. Upload to Supabase Storage Bucket 'profile-avatars'
      const uploadUrl = `${dbConfig.url}/storage/v1/object/profile-avatars/${storagePath}`;
      
      const storageRes = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          apikey: dbConfig.key,
          Authorization: `Bearer ${dbConfig.key}`,
          'Content-Type': 'image/webp',
          'x-upsert': 'true',
        },
        body: optimizedBuffer,
      });

      if (!storageRes.ok) {
        const errText = await storageRes.text().catch(() => '');
        console.warn(`[SupabaseStorage] Upload failed (${storageRes.status}):`, errText);
        // Fallback to local streaming route if storage bucket is initializing
        MEMORY_AVATAR_STORAGE.set(session.memberId, {
          buffer: optimizedBuffer,
          mimeType: 'image/webp',
          updatedAt: new Date().toISOString(),
        });
        finalAvatarUrl = `/api/member/avatar?id=${session.memberId}&v=${timestamp}`;
      } else {
        // Construct canonical public storage URL with cache-busting version parameter
        finalAvatarUrl = `${dbConfig.url}/storage/v1/object/public/profile-avatars/${storagePath}?v=${timestamp}`;
      }
    } else {
      // 4b. Local / In-Memory Mock Mode
      MEMORY_AVATAR_STORAGE.set(session.memberId, {
        buffer: optimizedBuffer,
        mimeType: 'image/webp',
        updatedAt: new Date().toISOString(),
      });
      finalAvatarUrl = `/api/member/avatar?id=${session.memberId}&v=${timestamp}`;
    }

    // 5. Update canonical Member Profile in Store / Database
    const updatedMember = await updateMemberProfile(session.memberId, {
      avatar_url: finalAvatarUrl,
    });

    return NextResponse.json({
      success: true,
      avatarUrl: finalAvatarUrl,
      member: updatedMember,
      message: 'Profile photo updated successfully.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to process image upload.';
    console.error('[AvatarUploadError]:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/member/avatar
 * Removes the member profile photo and restores default initials.
 */
export async function DELETE(request: Request) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in as a Member.' }, { status: 401 });
  }

  try {
    const dbConfig = getDbConfig();
    const storagePath = `${session.memberId}/avatar.webp`;

    // 1. Delete from Supabase Storage if configured
    if (dbConfig) {
      const deleteUrl = `${dbConfig.url}/storage/v1/object/profile-avatars/${storagePath}`;
      await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          apikey: dbConfig.key,
          Authorization: `Bearer ${dbConfig.key}`,
        },
      }).catch((e) => console.warn('[SupabaseStorageDeleteError]:', e));
    }

    // 2. Delete from Memory Storage
    MEMORY_AVATAR_STORAGE.delete(session.memberId);

    // 3. Clear avatar_url on canonical Member profile
    const updatedMember = await updateMemberProfile(session.memberId, {
      avatar_url: undefined,
    });

    return NextResponse.json({
      success: true,
      avatarUrl: null,
      member: updatedMember,
      message: 'Profile photo removed successfully.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to remove profile photo.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/member/avatar?id=...
 * Serves avatar binary for local development or fallback streaming.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const memberId = searchParams.get('id');

  if (!memberId) {
    return new NextResponse('Member ID required', { status: 400 });
  }

  const stored = MEMORY_AVATAR_STORAGE.get(memberId);
  if (!stored) {
    return new NextResponse('Avatar not found', { status: 404 });
  }

  return new NextResponse(new Uint8Array(stored.buffer), {
    headers: {
      'Content-Type': stored.mimeType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Avatar-Updated': stored.updatedAt,
    },
  });
}
