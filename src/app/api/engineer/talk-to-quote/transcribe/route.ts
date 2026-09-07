/**
 * TALK TO QUOTE — AUDIO TRANSCRIPTION ENDPOINT
 * ============================================
 * Transcribes mobile audio stream using OpenAI Whisper API when available,
 * with graceful fallback to client-side Web Speech recognition.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as Blob | null;

    if (!audioFile) {
      return NextResponse.json({ error: 'Audio file is required' }, { status: 400 });
    }

    if (!apiKey) {
      // Whisper not configured -> notify client to use Web Speech transcript fallback
      return NextResponse.json({
        success: false,
        useWebSpeechFallback: true,
        message: 'OpenAI Whisper API not configured on server. Use Web Speech transcript.',
      });
    }

    // Call Whisper API
    const whisperFormData = new FormData();
    whisperFormData.append('file', audioFile, 'recording.webm');
    whisperFormData.append('model', 'whisper-1');
    whisperFormData.append('language', 'en');
    whisperFormData.append('prompt', 'EntireCAFM Facilities Management: Grundfos, Wilo, pump, AHU, boiler, mechanical seal, LSH, plant room, HVAC');

    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: whisperFormData,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.warn('[WHISPER_ERROR]', res.status, errText);
      return NextResponse.json({
        success: false,
        useWebSpeechFallback: true,
        error: `Whisper API failed (${res.status})`,
      });
    }

    const data = await res.json();
    return NextResponse.json({
      success: true,
      transcript: data.text || '',
    });
  } catch (err: any) {
    console.error('[TRANSCRIBE_EXCEPTION]', err);
    return NextResponse.json({
      success: false,
      useWebSpeechFallback: true,
      error: err.message,
    });
  }
}
