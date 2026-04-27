export type Page = 'overview' | 'pilot' | 'research' | 'about';

export const SITE_NAME = 'WeDesign+';
export const SITE_CREATOR = 'Rashid Mushkani';
export const SITE_ALTERNATE_NAMES = [
  'WeDesign',
  'WeDesign+',
  'WeDesign Plus',
  'WeDesignPlus',
  'WeDesignplus',
  'wedesign',
  'wedesign+',
  'wedesign plus',
  'wedesignplus',
  'wedesign.plus',
] as const;
export const SITE_DESCRIPTION =
  'WeDesign+ by Rashid Mushkani helps communities align around civic design decisions through visual public consultation, rapid concept comparison, and participatory urban dialogue.';
export const SITE_KEYWORDS =
  'WeDesign+, WeDesign, WeDesign Plus, WeDesignPlus, WeDesignplus, wedesign, wedesign+, wedesign plus, wedesignplus, wedesign.plus, Rashid Mushkani, visual public consultation, civic consultation, community consultation, public consultation design, civic design, participatory urban design, urban design consultation, inclusive AI';
export const SITE_TITLE_SUFFIX = `Visual Public Consultations by ${SITE_CREATOR}`;
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
    keywords: string;
    shortTitle: string;
    title?: string;
  }
> = {
  overview: {
    shortTitle: 'Overview',
    title: 'WeDesign+ by Rashid Mushkani | Visual Public Consultations',
    description: SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
  },
  pilot: {
    shortTitle: 'Pilot: Sainte-Marie',
    description:
      'Explore the Sainte-Marie pilot: a compressed civic consultation that helped Montreal residents compare live visual proposals and converge on a shared direction in two days.',
    keywords:
      'WeDesign+, WeDesign, Rashid Mushkani, Sainte-Marie pilot, Montreal civic consultation, participatory urban design, visual public consultation',
  },
  research: {
    shortTitle: 'Research',
    description:
      'Review the research foundation behind WeDesign+, including alignment datasets, participatory evaluation methods, and academic publications on inclusive civic design.',
    keywords:
      'WeDesign+, WeDesign, Rashid Mushkani, AI Alignment for Inclusion, AIAI, inclusive AI, public-space research, civic consultation research',
  },
  about: {
    shortTitle: 'About',
    title: 'About WeDesign+ and Rashid Mushkani | WeDesign+',
    description:
      'Learn how WeDesign+ and Rashid Mushkani build on AI Alignment for Inclusion (AIAI), bringing together urban design, public participation, and responsible AI to support more inclusive public-space consultation.',
    keywords:
      'Rashid Mushkani, WeDesign+, WeDesign, wedesign, AIAI, AI Alignment for Inclusion, public participation, responsible AI, inclusive public space',
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
      details.title ||
      (page === 'overview'
        ? `${SITE_NAME} | ${SITE_TITLE_SUFFIX}`
        : `${details.shortTitle} | ${SITE_NAME}`),
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
