export type StudioConcept = {
  name: string;
  desc: string;
  match: number;
};

export const MAX_STUDIO_PROMPT_LENGTH = 320;

export const PROJECT_BRIEF =
  'Transforming the St. Henri quadrant into a resilient, pedestrian-first ecosystem while preserving historical industrial textures.';

export const INITIAL_CONCEPTS: StudioConcept[] = [
  {
    name: 'Concept A: Density+',
    match: 92,
    desc: 'Focuses on affordability through maximized living units and communal green roofs.',
  },
  {
    name: 'Concept B: Flow State',
    match: 74,
    desc: 'Prioritizes mobility networks and bike-priority arteries over total square footage.',
  },
  {
    name: 'Concept C: The Canopy',
    match: 68,
    desc: 'Maximum environmental cooling through bio-retention swales and full shade cover.',
  },
];

export const STUDIO_SERVER_NOTE =
  'Concept generation runs through a server-side API so provider credentials never ship to the browser.';

export async function generateStudioConcept(
  userPrompt: string,
): Promise<StudioConcept> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 20_000);

  try {
    const response = await fetch('/api/generate-concept', {
      body: JSON.stringify({
        prompt: userPrompt,
      }),
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      signal: controller.signal,
    });

    const payload = await readJsonPayload(response);

    if (!response.ok) {
      throw new Error(readStudioError(payload));
    }

    return normalizeStudioConcept(payload.concept);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Concept generation timed out. Please try again.');
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function readJsonPayload(response: Response) {
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    throw new Error('The studio service returned an unexpected response.');
  }

  return response.json() as Promise<{
    concept?: Partial<StudioConcept>;
    error?: string;
  }>;
}

function readStudioError(payload: { error?: string }) {
  if (typeof payload.error === 'string' && payload.error.trim()) {
    return payload.error;
  }

  return 'Concept generation failed. Please try again.';
}

function normalizeStudioConcept(concept?: Partial<StudioConcept>): StudioConcept {
  if (!concept) {
    throw new Error('The studio service returned an empty concept.');
  }

  return {
    desc:
      typeof concept.desc === 'string' && concept.desc.trim()
        ? concept.desc.trim()
        : 'A new civic concept was generated from the resident prompt.',
    match: clampMatch(concept.match),
    name:
      typeof concept.name === 'string' && concept.name.trim()
        ? concept.name.trim()
        : 'Concept D: Common Ground',
  };
}

function clampMatch(value: unknown) {
  const numericValue = typeof value === 'number' ? value : Number(value);

  if (Number.isNaN(numericValue)) {
    return 75;
  }

  return Math.min(95, Math.max(60, Math.round(numericValue)));
}
