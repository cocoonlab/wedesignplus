export type Page = 'overview' | 'pilot' | 'research' | 'about';

export const SITE_NAME = 'WeDesign+';
export const SITE_TITLE_SUFFIX = 'Visual Public Consultations';
export const DEFAULT_SITE_URL = 'https://www.wedesign.plus';
export const SITE_ORIGIN = normalizeOrigin(
  import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL,
);
export const SOCIAL_IMAGE_PATH = '/social-preview.jpg';
export const SOCIAL_IMAGE_URL = `${SITE_ORIGIN}${SOCIAL_IMAGE_PATH}`;

export const PAGE_LABELS: Record<Page, string> = {
  overview: 'Overview',
  pilot: 'Pilot',
  research: 'Research',
  about: 'About',
};

export const PAGE_PATHS: Record<Page, string> = {
  overview: '/',
  pilot: '/pilot',
  research: '/research',
  about: '/about',
};

const PAGE_ALIASES: Record<string, Page> = {
  '/': 'overview',
  '/overview': 'overview',
  '/pilot': 'pilot',
  '/research': 'research',
  '/about': 'about',
};

const PAGE_DETAILS: Record<
  Page,
  {
    description: string;
    shortTitle: string;
  }
> = {
  overview: {
    shortTitle: 'Overview',
    description:
      'WeDesign+ helps communities align around civic design decisions through visual public consultation, rapid concept comparison, and participatory urban dialogue.',
  },
  pilot: {
    shortTitle: 'Pilot: Sainte-Marie',
    description:
      'Explore the Sainte-Marie pilot: a compressed civic consultation that helped Montreal residents compare live visual proposals and converge on a shared direction in two days.',
  },
  research: {
    shortTitle: 'Research',
    description:
      'Review the research foundation behind WeDesign+, including alignment datasets, participatory evaluation methods, and academic publications on inclusive civic design.',
  },
  about: {
    shortTitle: 'About',
    description:
      'Learn how WeDesign+ emerged from AI Alignment for Inclusion, bringing together urban design, public participation, and responsible AI to support more inclusive public-space consultation.',
  },
};

export function getPageFromPath(pathname: string): Page {
  const normalizedPath = normalizePath(pathname);

  return PAGE_ALIASES[normalizedPath] || 'overview';
}

export function getPageHref(page: Page) {
  return PAGE_PATHS[page];
}

export function getPageMetadata(page: Page) {
  const details = PAGE_DETAILS[page];
  const path = PAGE_PATHS[page];

  return {
    ...details,
    path,
    title:
      page === 'overview'
        ? `${SITE_NAME} | ${SITE_TITLE_SUFFIX}`
        : `${details.shortTitle} | ${SITE_NAME}`,
    url: `${SITE_ORIGIN}${path === '/' ? '/' : path}`,
  };
}

function normalizeOrigin(value: string) {
  return value.trim().replace(/\/+$/, '');
}

function normalizePath(pathname: string) {
  if (!pathname || pathname === '/') {
    return '/';
  }

  return pathname.replace(/\/+$/, '');
}
