import {
  assertJsonRequest,
  assertRequestSize,
  assertStudioOrigin,
  createStudioConcept,
  getStudioErrorResponse,
  getStudioServerConfig,
  normalizeStudioPrompt,
} from '../src/lib/studio-server';

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    assertStudioOrigin(
      request.headers.get('origin'),
      request.headers.get('host'),
    );
    assertRequestSize(request.headers.get('content-length'));
    assertJsonRequest(request.headers.get('content-type'));

    const body = await request.json();
    const prompt = normalizeStudioPrompt(body?.prompt);
    const concept = await createStudioConcept(
      prompt,
      getStudioServerConfig(process.env),
    );

    return jsonResponse({ concept });
  } catch (error) {
    const { error: message, status } = getStudioErrorResponse(error);
    return jsonResponse({ error: message }, { status });
  }
}

export function GET() {
  return methodNotAllowed();
}

export function PUT() {
  return methodNotAllowed();
}

export function PATCH() {
  return methodNotAllowed();
}

export function DELETE() {
  return methodNotAllowed();
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: baseHeaders({
      Allow: 'POST, OPTIONS',
    }),
  });
}

function methodNotAllowed() {
  return jsonResponse(
    { error: 'Method not allowed.' },
    {
      status: 405,
      headers: {
        Allow: 'POST, OPTIONS',
      },
    },
  );
}

function jsonResponse(
  payload: unknown,
  init: {
    headers?: Record<string, string>;
    status?: number;
  } = {},
) {
  return new Response(JSON.stringify(payload), {
    status: init.status ?? 200,
    headers: baseHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      ...init.headers,
    }),
  });
}

function baseHeaders(extraHeaders: Record<string, string> = {}) {
  return {
    'Cache-Control': 'no-store',
    ...extraHeaders,
  };
}
