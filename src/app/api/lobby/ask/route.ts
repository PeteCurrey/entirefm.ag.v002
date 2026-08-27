import { NextResponse } from 'next/server';
import { askTheLobbyEngine } from '@/server/ask/ask-engine';
import type { UKJurisdiction } from '@/server/intelligence/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, jurisdiction } = body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Question is required' },
        { status: 400 }
      );
    }

    const answer = await askTheLobbyEngine.answerQuestion(question, {
      jurisdictionOverride: jurisdiction as UKJurisdiction | undefined,
    });

    return NextResponse.json({
      success: true,
      answer,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: (err as Error).message || 'Failed to process question',
      },
      { status: 500 }
    );
  }
}
