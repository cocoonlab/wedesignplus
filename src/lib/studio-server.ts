import { GoogleGenAI, Type } from '@google/genai';
import {
  MAX_STUDIO_PROMPT_LENGTH,
  PROJECT_BRIEF,
  type StudioConcept,
} from './studio';

const DEFAULT_STUDIO_MODEL = 'gemini-2.5-flash';
const MAX_STUDIO_REQUEST_BYTES = 4_096;
const MIN_STUDIO_PROMPT_LENGTH = 12;

class StudioHttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'StudioHttpError';
  }
}

export function getStudioServerConfig(
  env: Record<string, string | undefined>,
) {
  return {
    apiKey: env.GEMINI_API_KEY?.trim(),
    model: env.GEMINI_MODEL?.trim() || DEFAULT_STUDIO_MODEL,
  };
}

export function assertStudioOrigin(origin: string | null, host: string | null) {
  if (!origin || !host) {
    throw new StudioHttpError(
      403,
      'This endpoint only accepts same-origin browser requests.',
    );
  }

  let originUrl: URL;

  try {
    originUrl = new URL(origin);
  } catch {
    throw new StudioHttpError(403, 'Invalid request origin.');
  }

  if (originUrl.host !== host) {
    throw new StudioHttpError(403, 'Cross-origin requests are not allowed.');
  }
}

export function assertRequestSize(contentLength: string | null) {
  if (!contentLength) {
    return;
  }

  const requestSize = Number(contentLength);

  if (!Number.isNaN(requestSize) && requestSize > MAX_STUDIO_REQUEST_BYTES) {
    throw new StudioHttpError(413, 'Request body is too large.');
  }
}

export function assertJsonRequest(contentType: string | null) {
  if (!contentType?.includes('application/json')) {
    throw new StudioHttpError(
      415,
      'Use application/json when calling the studio API.',
    );
  }
}

export function normalizeStudioPrompt(prompt: unknown) {
  if (typeof prompt !== 'string') {
    throw new StudioHttpError(
      400,
      'Provide a text prompt describing the concept you want to explore.',
    );
  }

  const normalizedPrompt = prompt.trim().replace(/\s+/g, ' ');

  if (normalizedPrompt.length < MIN_STUDIO_PROMPT_LENGTH) {
    throw new StudioHttpError(
      400,
      `Please provide at least ${MIN_STUDIO_PROMPT_LENGTH} characters of detail.`,
    );
  }

  if (normalizedPrompt.length > MAX_STUDIO_PROMPT_LENGTH) {
    throw new StudioHttpError(
      413,
      `Keep prompts under ${MAX_STUDIO_PROMPT_LENGTH} characters.`,
    );
  }

  return normalizedPrompt;
}

export async function createStudioConcept(
  prompt: string,
  config: {
    apiKey?: string;
    model?: string;
  },
): Promise<StudioConcept> {
  if (!config.apiKey) {
    throw new StudioHttpError(
      503,
      'Concept generation is not configured on the server. Set GEMINI_API_KEY and redeploy.',
    );
  }

  const ai = new GoogleGenAI({
    apiKey: config.apiKey,
  });

  const response = await ai.models.generateContent({
    model: config.model || DEFAULT_STUDIO_MODEL,
    contents: `Generate a new urban design concept for a civic consultation based on this resident input: "${prompt}".
The project brief is: "${PROJECT_BRIEF}".
Return a JSON object with:
- name: A short concept title in the format "Concept D: [Name]"
- desc: A one-sentence description focused on civic outcomes
- match: A number between 60 and 95 representing alignment`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          desc: { type: Type.STRING },
          match: { type: Type.NUMBER },
        },
        required: ['name', 'desc', 'match'],
      },
    },
  });

  let parsedConcept: Partial<StudioConcept>;

  try {
    parsedConcept = JSON.parse(response.text) as Partial<StudioConcept>;
  } catch {
    throw new StudioHttpError(
      502,
      'The model returned an unreadable response. Please try again.',
    );
  }

  return {
    name: parsedConcept.name?.trim() || 'Concept D: Common Ground',
    desc:
      parsedConcept.desc?.trim() ||
      'A new civic concept was generated from the resident prompt.',
    match: clampMatch(parsedConcept.match),
  };
}

export function getStudioErrorResponse(error: unknown) {
  if (error instanceof StudioHttpError) {
    return {
      error: error.message,
      status: error.status,
    };
  }

  console.error('Studio API failure', error);

  return {
    error: 'Concept generation failed. Please try again in a moment.',
    status: 500,
  };
}

function clampMatch(value: unknown) {
  const numericValue = typeof value === 'number' ? value : Number(value);

  if (Number.isNaN(numericValue)) {
    return 75;
  }

  return Math.min(95, Math.max(60, Math.round(numericValue)));
}
