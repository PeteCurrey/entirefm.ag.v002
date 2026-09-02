import { getConversationById, subscribeToDMEvents } from '@/server/messages/message-store';
import { getMemberSessionFromRequest } from '@/server/member/member-session';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { id: convId } = await params;
  try {
    const conversation = await getConversationById(convId, session.memberId);
    if (!conversation) {
      return new Response('Conversation not found', { status: 404 });
    }
  } catch {
    return new Response('Unauthorized', { status: 403 });
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`)
      );

      const unsubscribe = subscribeToDMEvents(convId, (event) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        } catch {
          unsubscribe();
        }
      });

      request.signal.addEventListener('abort', () => {
        unsubscribe();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
