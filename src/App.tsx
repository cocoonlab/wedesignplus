import {
  useEffect,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, PlayCircle, Sparkles } from 'lucide-react';
import splashLogo from './assets/brand/splash.png';
import overviewDescribeImage from './assets/pages/overview/typing-needs.jpg';
import overviewHeroConsultationImage from './assets/pages/overview/live-consultation.jpg';
import overviewExistingSiteImage from './assets/pages/overview/existing-site.jpg';
import pilotDemoGif from './assets/pages/pilot/demo-wedesign.gif';
import pilotConsultationVideo from './assets/pages/pilot/wedesign-cdc-consultation.mp4';
import pilotGeneratedDesign1 from './assets/pages/pilot/generated-design-1.png';
import pilotGeneratedDesign2 from './assets/pages/pilot/generated-design-2.png';
import pilotGeneratedDesign3 from './assets/pages/pilot/generated-design-3.png';
import researchWorkshopImage from './assets/pages/research/dataset-creation-workshop.jpg';
import { cn } from './lib/utils';
import {
  getPageFromPath,
  getPageHref,
  getPageMetadata,
  PAGE_LABELS,
  SITE_NAME,
  SITE_ORIGIN,
  SOCIAL_IMAGE_URL,
  type Page,
} from './lib/site';

const NAV_PAGES: Page[] = ['overview', 'pilot', 'research'];
const CONTACT_EMAIL = 'rashid@cocoonlab.ai';
const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  'WeDesign+ Studio inquiry',
)}&body=${encodeURIComponent(
  "Hi Rashid,\n\nI'd love to learn more about WeDesign+ Studio.\n\nBest,\n",
)}`;
const PILOT_ITERATIONS = [
  {
    src: pilotGeneratedDesign1,
    label: 'Iteration 01',
    note: 'Opening scenario used to spark discussion in the room.',
  },
  {
    src: pilotGeneratedDesign2,
    label: 'Iteration 02',
    note: 'Refined live as residents reacted to density and greening trade-offs.',
  },
  {
    src: pilotGeneratedDesign3,
    label: 'Iteration 03',
    note: 'Later-round option tested against the priorities participants shared.',
  },
] as const;

const BrandMark = ({ className = '' }: { className?: string }) => (
  <img
    src={splashLogo}
    alt=""
    aria-hidden="true"
    className={cn('h-11 w-11 object-contain drop-shadow-[0_10px_24px_rgba(123,95,133,0.16)]', className)}
    loading="eager"
  />
);

type NavigateToPage = (page: Page) => void;

function EmailInquiryLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={CONTACT_MAILTO}
      title={`Email ${CONTACT_EMAIL}`}
      className={cn('cursor-pointer', className)}
      onClick={handleEmailInquiryClick}
    >
      {children}
    </a>
  );
}

function PageLink({
  page,
  navigateToPage,
  className,
  children,
  ariaCurrent,
  ariaLabel,
}: {
  key?: string;
  page: Page;
  navigateToPage: NavigateToPage;
  className?: string;
  children: ReactNode;
  ariaCurrent?: 'page';
  ariaLabel?: string;
}) {
  const href = getPageHref(page);

  return (
    <a
      href={href}
      aria-current={ariaCurrent}
      aria-label={ariaLabel}
      className={className}
      onClick={(event) => handlePageLinkClick(event, page, navigateToPage)}
    >
      {children}
    </a>
  );
}

function handlePageLinkClick(
  event: ReactMouseEvent<HTMLAnchorElement>,
  page: Page,
  navigateToPage: NavigateToPage,
) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  event.preventDefault();
  navigateToPage(page);
}

function handleEmailInquiryClick(event: ReactMouseEvent<HTMLAnchorElement>) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  event.preventDefault();

  if (typeof window !== 'undefined') {
    window.location.assign(CONTACT_MAILTO);
  }
}

function usePageRouting() {
  const [page, setPage] = useState<Page>(() => {
    if (typeof window === 'undefined') {
      return 'overview';
    }

    return getPageFromPath(window.location.pathname);
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const normalizedPage = getPageFromPath(window.location.pathname);

    setPage(normalizedPage);

    if (window.location.pathname === '/overview') {
      window.history.replaceState({ page: normalizedPage }, '', '/');
    }

    const handlePopState = () => {
      setPage(getPageFromPath(window.location.pathname));
      window.scrollTo({ top: 0, behavior: 'auto' });
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigateToPage = (nextPage: Page) => {
    setPage(nextPage);

    if (typeof window !== 'undefined') {
      const nextHref = getPageHref(nextPage);

      if (window.location.pathname !== nextHref) {
        window.history.pushState({ page: nextPage }, '', nextHref);
      }

      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  return {
    navigateToPage,
    page,
  };
}

function useSeo(page: Page) {
  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const metadata = getPageMetadata(page);
    const siteDescription =
      'WeDesign+ helps communities compare civic design directions through visual consultation, live concept generation, and research-led public participation.';

    document.title = metadata.title;
    document.documentElement.lang = 'en-CA';

    upsertMetaTag('name', 'description', metadata.description);
    upsertMetaTag(
      'name',
      'robots',
      'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
    );
    upsertMetaTag('name', 'author', SITE_NAME);
    upsertMetaTag('property', 'og:type', 'website');
    upsertMetaTag('property', 'og:site_name', SITE_NAME);
    upsertMetaTag('property', 'og:locale', 'en_CA');
    upsertMetaTag('property', 'og:title', metadata.title);
    upsertMetaTag('property', 'og:description', metadata.description);
    upsertMetaTag('property', 'og:url', metadata.url);
    upsertMetaTag('property', 'og:image', SOCIAL_IMAGE_URL);
    upsertMetaTag(
      'property',
      'og:image:alt',
      'WeDesign+ live public consultation session',
    );
    upsertMetaTag('name', 'twitter:card', 'summary_large_image');
    upsertMetaTag('name', 'twitter:title', metadata.title);
    upsertMetaTag('name', 'twitter:description', metadata.description);
    upsertMetaTag('name', 'twitter:image', SOCIAL_IMAGE_URL);
    upsertCanonicalLink(metadata.url);
    upsertStructuredData('wedesignplus-structured-data', [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${SITE_ORIGIN}/#organization`,
        name: SITE_NAME,
        url: `${SITE_ORIGIN}/`,
        description: siteDescription,
        email: `mailto:${CONTACT_EMAIL}`,
        logo: `${SITE_ORIGIN}/apple-touch-icon.png`,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE_ORIGIN}/#website`,
        name: SITE_NAME,
        url: `${SITE_ORIGIN}/`,
        description: siteDescription,
        publisher: {
          '@id': `${SITE_ORIGIN}/#organization`,
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${metadata.url}#webpage`,
        name: metadata.title,
        url: metadata.url,
        description: metadata.description,
        isPartOf: {
          '@id': `${SITE_ORIGIN}/#website`,
        },
        about: 'Visual civic consultation',
        inLanguage: 'en',
      },
    ]);
  }, [page]);
}

function upsertMetaTag(
  attribute: 'name' | 'property',
  key: string,
  content: string,
) {
  const selector = `meta[${attribute}="${key}"]`;
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function upsertCanonicalLink(href: string) {
  let element = document.head.querySelector('link[rel="canonical"]');

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
}

function upsertStructuredData(id: string, payload: unknown) {
  let element = document.getElementById(id);

  if (!element) {
    element = document.createElement('script');
    element.setAttribute('type', 'application/ld+json');
    element.setAttribute('id', id);
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(payload);
}

const Navbar = ({
  activePage,
  navigateToPage,
}: {
  activePage: Page;
  navigateToPage: NavigateToPage;
}) => (
  <header className="w-full top-0 sticky z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
    <nav className="flex justify-between items-center w-full max-w-[1440px] mx-auto px-5 py-4 sm:px-8 sm:py-6">
      <PageLink
        page="overview"
        navigateToPage={navigateToPage}
        ariaLabel="Go to overview"
        className="group inline-flex items-center"
      >
        <span className="font-sans text-xl font-bold tracking-tight text-primary transition-colors duration-300 group-hover:text-primary/85">
          WeDesign+
        </span>
      </PageLink>
      <div className="hidden md:flex space-x-8">
        {NAV_PAGES.map((page) => (
          <PageLink
            key={page}
            page={page}
            navigateToPage={navigateToPage}
            ariaCurrent={activePage === page ? 'page' : undefined}
            className={cn(
              'text-sm uppercase tracking-widest transition-all duration-300 pb-1',
              activePage === page
                ? 'text-primary border-b-2 border-primary font-bold'
                : 'text-stone-500 hover:text-primary',
            )}
          >
            {PAGE_LABELS[page]}
          </PageLink>
        ))}
      </div>
      <EmailInquiryLink className="group ml-3 shrink-0 border border-primary bg-primary px-2.5 py-2 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 sm:ml-4 sm:px-3 md:px-5 md:py-3">
        <span className="hidden font-sans text-[10px] uppercase tracking-[0.28em] text-white/70 md:block">
          Studio Inquiries
        </span>
        <span className="flex items-center gap-2 text-[11px] font-sans font-bold uppercase tracking-[0.18em] md:mt-1 md:text-sm">
          Email Rashid
          <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
        <span className="mt-1 hidden font-sans text-[11px] tracking-[0.04em] text-white/75 md:block">
          {CONTACT_EMAIL}
        </span>
      </EmailInquiryLink>
    </nav>
    <div className="border-t border-outline-variant/10 px-5 pb-3 sm:px-8 sm:pb-4 md:hidden">
      <div className="mx-auto flex max-w-[1440px] items-center gap-5 overflow-x-auto pt-4">
        {NAV_PAGES.map((page) => (
          <PageLink
            key={page}
            page={page}
            navigateToPage={navigateToPage}
            ariaCurrent={activePage === page ? 'page' : undefined}
            className={cn(
              'shrink-0 text-xs uppercase tracking-[0.24em] transition-colors duration-300',
              activePage === page ? 'text-primary font-bold' : 'text-stone-500',
            )}
          >
            {PAGE_LABELS[page]}
          </PageLink>
        ))}
      </div>
    </div>
  </header>
);

const Footer = ({ navigateToPage }: { navigateToPage: NavigateToPage }) => (
  <footer className="w-full border-t border-outline-variant/20 bg-surface-container-highest mt-20 md:mt-24">
    <div className="grid w-full max-w-[1440px] mx-auto grid-cols-1 gap-10 px-5 py-12 sm:px-8 md:grid-cols-3 md:gap-12 md:px-12 md:py-16">
      <div className="space-y-6">
        <BrandMark className="h-16 w-16" />
        <p className="font-sans text-xs uppercase tracking-tighter text-stone-600 leading-relaxed max-w-xs">
          Civic technology for the next generation of participatory urban design.
          Rebuilding trust through radical visual transparency.
        </p>
      </div>
      <div className="flex flex-col space-y-4">
        <span className="font-sans text-xs uppercase tracking-widest font-bold mb-2">
          Explore
        </span>
        {NAV_PAGES.map((page) => (
          <PageLink
            key={page}
            page={page}
            navigateToPage={navigateToPage}
            className="text-left text-stone-600 text-xs uppercase tracking-tighter hover:text-primary transition-all"
          >
            {PAGE_LABELS[page]}
          </PageLink>
        ))}
      </div>
      <div className="space-y-4">
        <span className="font-sans text-xs uppercase tracking-widest font-bold mb-2 block">
          Contact
        </span>
        <EmailInquiryLink className="inline-flex items-center gap-2 font-sans text-sm uppercase tracking-[0.18em] text-primary transition-colors hover:text-stone-900">
          Email Rashid
          <ArrowUpRight size={14} />
        </EmailInquiryLink>
        <p className="font-sans text-xs leading-relaxed text-stone-600 max-w-xs">
          For studio walkthroughs, pilot briefings, and collaboration inquiries.
        </p>
        <p className="font-sans text-xs uppercase tracking-tighter text-stone-600">
          © 2026 WeDesign+ Civic Consultation. Montreal, QC.
        </p>
      </div>
    </div>
  </footer>
);

const OverviewPage = ({
  navigateToPage,
}: {
  navigateToPage: NavigateToPage;
}) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <section className="max-w-[1440px] mx-auto px-5 pt-16 pb-20 sm:px-8 sm:pt-20 sm:pb-24 md:pb-32 lg:pt-24">
      <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="asymmetric-header max-w-4xl lg:col-span-7">
          <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl italic font-light text-stone-900 leading-tight">
            Visual public consultations{' '}
            <span className="text-primary">shaped by local values.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-xl font-serif font-light leading-relaxed text-stone-600 sm:mt-10 sm:text-2xl md:mt-12 md:text-3xl">
            Moving from abstract bureaucratic plans to immediate, tangible visual
            consensus. We bridge the gap between policy and people.
          </p>
          <div className="mt-10 flex flex-col items-start gap-6 sm:mt-12 sm:flex-row sm:items-center md:mt-16">
            <PageLink
              page="pilot"
              navigateToPage={navigateToPage}
              className="flex items-center space-x-3 text-stone-600 group"
            >
              <PlayCircle className="text-3xl" />
              <span className="font-sans text-sm uppercase tracking-widest group-hover:text-primary transition-colors">
                See the Pilot
              </span>
            </PageLink>
          </div>
        </div>
        <div className="lg:col-span-5">
          <figure className="relative overflow-hidden rounded-[32px] border border-outline-variant/20 bg-surface-container-low shadow-[0_30px_80px_rgba(28,25,23,0.12)]">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                className="h-full w-full object-cover"
                src={overviewHeroConsultationImage}
                alt="Live consultation session"
                loading="eager"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/10 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.28em] text-white backdrop-blur-md">
                Live Consultation
              </span>
              <p className="mt-4 max-w-sm text-2xl italic leading-snug text-white">
                Residents, facilitators, and visual proposals aligned in the same
                conversation.
              </p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section className="bg-surface-container-low px-5 py-20 sm:px-8 sm:py-24 md:py-32">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div>
          <span className="font-sans text-sm uppercase tracking-[0.3em] text-primary mb-6 block">
            The Cost of Delay
          </span>
          <h2 className="mb-8 text-4xl italic sm:text-5xl">
            The Risk of Abstract Consultation
          </h2>
          <p className="mb-12 text-base leading-relaxed text-stone-600 sm:text-lg">
            Traditional civic engagement happens too late. By the time a project
            is visualized, decisions are often immutable. This &quot;Consultation
            Gap&quot; leads to project friction, community resentment, and lost
            trust.
          </p>
          <div className="rounded-xl border border-outline-variant/10 bg-white p-8 shadow-sm sm:p-10 md:p-12">
            <div className="flex items-end justify-between h-48 space-x-4 mb-6">
              <div className="w-full bg-surface-container-high h-[20%] transition-all relative group">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-sans uppercase">
                  Early Concept
                </div>
              </div>
              <div className="w-full bg-surface-container-high h-[45%] transition-all" />
              <div className="w-full bg-primary/40 h-[75%] transition-all" />
              <div className="w-full bg-red-600 h-[100%] transition-all relative group">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-sans text-red-600 font-bold uppercase whitespace-nowrap">
                  Max Conflict Risk
                </div>
              </div>
            </div>
            <div className="flex justify-between font-sans text-[10px] uppercase tracking-widest text-stone-500">
              <span>Stage 1: Ideation</span>
              <span>Stage 4: Implementation</span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <figure className="relative overflow-hidden rounded-[28px] border border-outline-variant/20 bg-stone-950 shadow-[0_24px_70px_rgba(28,25,23,0.14)]">
            <div className="aspect-[5/4] overflow-hidden">
              <img
                className="h-full w-full object-cover"
                src={overviewExistingSiteImage}
                alt="Existing urban site condition before redesign"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/15 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 md:p-8">
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/70">
                Existing Condition
              </span>
              <p className="max-w-md text-2xl italic leading-snug text-white">
                Without a shared visual language, public conversations stay vague
                and conflict arrives late.
              </p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section className="max-w-[1440px] mx-auto px-5 py-20 sm:px-8 sm:py-24 md:py-32">
      <div className="text-center mb-24">
        <span className="font-sans text-sm uppercase tracking-[0.3em] text-primary mb-4 block">
          The WeDesign+ Methodology
        </span>
        <h2 className="text-5xl italic sm:text-6xl">A cycle of clarity.</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[800px]">
        <div className="md:col-span-8 bg-surface-container-low p-8 sm:p-10 md:p-12 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-primary text-white flex items-center justify-center font-sans mb-8">
              01
            </div>
            <h3 className="text-4xl italic mb-4">Describe</h3>
            <p className="text-stone-600 max-w-md">
              Citizens express their needs in natural language, not technical
              jargon. We capture the essence of what &quot;home&quot; or
              &quot;safety&quot; looks like to them.
            </p>
          </div>
          <div className="relative mt-12 overflow-hidden rounded-[24px] border border-outline-variant/20 shadow-sm">
            <img
              className="h-56 w-full object-cover sm:h-64 md:h-72"
              src={overviewDescribeImage}
              alt="Resident typing needs into the consultation interface"
              loading="lazy"
            />
            <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.28em] text-stone-700 backdrop-blur-sm">
              Describe
            </div>
          </div>
        </div>
        <div className="md:col-span-4 bg-primary text-white p-8 sm:p-10 md:p-12 flex flex-col justify-between civic-gradient">
          <div>
            <div className="w-12 h-12 bg-white text-primary flex items-center justify-center font-sans mb-8">
              02
            </div>
            <h3 className="text-4xl italic mb-4">Generate</h3>
            <p className="text-white/80">
              Our proprietary model renders high-fidelity visual possibilities in
              real-time, instantly manifesting civic desires into architectural
              vistas.
            </p>
          </div>
          <Sparkles className="h-16 w-16 opacity-20 sm:h-24 sm:w-24" />
        </div>
        <div className="md:col-span-4 bg-surface-container-highest p-8 sm:p-10 md:p-12 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 border border-primary text-primary flex items-center justify-center font-sans mb-8">
              03
            </div>
            <h3 className="text-4xl italic mb-4">Debate</h3>
            <p className="text-stone-600">
              Stakeholders critique visuals, not just documents. The debate moves
              from speculation to grounded aesthetic and functional feedback.
            </p>
          </div>
        </div>
        <div className="md:col-span-8 bg-white border border-outline-variant/30 p-8 sm:p-10 md:p-12 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="max-w-md">
              <div className="w-12 h-12 bg-tertiary text-white flex items-center justify-center font-sans mb-8">
                04
              </div>
              <h3 className="text-4xl italic mb-4">Decide</h3>
              <p className="text-stone-600">
                Achieve consensus backed by visual proof. We produce a final
                Consultation Record that serves as a visual mandate for developers.
              </p>
            </div>
            <div className="text-right">
              <span className="block font-sans text-4xl text-tertiary sm:text-5xl">90%</span>
              <span className="font-sans text-[10px] uppercase tracking-widest text-stone-500">
                Approval Rate
              </span>
            </div>
          </div>
          <div className="mt-8 flex space-x-2">
            <div className="h-2 bg-tertiary flex-1" />
            <div className="h-2 bg-tertiary flex-1" />
            <div className="h-2 bg-tertiary flex-1" />
            <div className="h-2 bg-surface-container-high flex-1" />
          </div>
        </div>
      </div>
    </section>
  </motion.div>
);

const PilotPage = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="max-w-[1440px] mx-auto px-5 py-12 sm:px-8 sm:py-14 md:px-24 md:py-16"
  >
    <section className="mb-20 sm:mb-24 md:mb-32">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
        <div className="md:col-span-8">
          <h1 className="mb-6 text-4xl italic font-light leading-tight sm:mb-8 sm:text-5xl md:text-8xl">
            Pilot: Sainte-Marie (2025)
          </h1>
          <p className="max-w-2xl text-xl leading-relaxed text-stone-600 sm:text-2xl md:text-3xl">
            From first input to shared direction in one workshop cycle. A
            documentary exploration of civic alignment in Montreal&apos;s historic
            district.
          </p>
        </div>
        <div className="md:col-span-4 pb-0 md:pb-4">
          <div className="grid grid-cols-3 gap-4 border-t border-outline-variant/30 pt-6 font-sans text-[10px] uppercase tracking-tighter sm:gap-6 sm:text-xs md:flex md:flex-col md:border-t-0 md:border-l md:pl-8 md:pt-0">
            <div>
              <span className="text-stone-400 block mb-1">Location</span>
              <span className="font-bold">Sainte-Marie, Montreal, QC</span>
            </div>
            <div>
              <span className="text-stone-400 block mb-1">Participants</span>
              <span className="font-bold">142 Registered</span>
            </div>
            <div>
              <span className="text-stone-400 block mb-1">Duration</span>
              <span className="font-bold">2 days</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="mb-20 sm:mb-24 md:mb-32 relative group">
      <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] border border-outline-variant/20 bg-stone-950 shadow-[0_30px_80px_rgba(28,25,23,0.14)]">
        <img
          className="h-full w-full object-contain"
          src={pilotDemoGif}
          alt="WeDesign+ pilot demo visual"
          loading="eager"
        />
      </div>
    </section>

    <section className="mb-32 grid grid-cols-1 gap-12 md:mb-48 md:grid-cols-12 md:gap-16">
      <div className="md:col-span-5 md:sticky top-32 h-fit">
        <h2 className="mb-6 font-sans text-3xl font-bold leading-none tracking-tighter uppercase sm:text-4xl">
          The Human <br />
          Perspective.
        </h2>
        <div className="w-12 h-1 bg-primary mb-8" />
        <blockquote className="mb-8 text-2xl italic leading-snug text-primary sm:text-3xl">
          &quot;For the first time, I didn&apos;t feel like I was filling out a
          form. I felt like I was contributing to a story that actually had an
          ending we all agreed on.&quot;
        </blockquote>
        <cite className="font-sans text-sm font-bold uppercase tracking-widest">
          - PILOT PARTICIPANT
        </cite>
      </div>
      <div className="md:col-span-7 space-y-16">
        <div className="space-y-8">
          <p className="text-lg leading-relaxed sm:text-xl">
            The Sainte-Marie pilot was designed to test the limits of compressed
            civic consultation. Traditional methods often stretch across months,
            leading to participant fatigue and data dilution. WeDesign+
            implemented a singular, high-intensity workshop cycle that bridged
            the gap between abstract planning and local reality.
          </p>
          <p className="text-lg leading-relaxed sm:text-xl">
            Using the WeDesign+ Studio environment, residents could visualize
            proposals in real time, discuss their needs, and refine their
            aspirations accordingly.
          </p>
        </div>
        <div className="space-y-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="font-sans text-xs uppercase tracking-[0.28em] text-primary">
                Live Concept Variants
              </span>
              <h3 className="mt-3 text-2xl italic leading-tight sm:text-3xl">
                Three directions reviewed in the same session.
              </h3>
            </div>
            <p className="max-w-sm font-sans text-xs uppercase tracking-[0.2em] text-stone-400">
              Generated options helped the group compare trade-offs without
              waiting weeks for revised drawings.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            <figure className="md:col-span-7 bg-white p-3 sm:p-4 border border-outline-variant/20 shadow-sm">
              <div className="aspect-square overflow-hidden bg-surface-container-low">
                <img
                  className="h-full w-full object-cover"
                  src={PILOT_ITERATIONS[0].src}
                  alt="Pilot concept iteration 01"
                  loading="eager"
                />
              </div>
              <figcaption className="pt-4">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-primary">
                    {PILOT_ITERATIONS[0].label}
                  </span>
                  <span className="self-start rounded-full bg-surface-container-low px-3 py-1 font-sans text-[10px] uppercase tracking-[0.22em] text-stone-500">
                    Reviewed live
                  </span>
                </div>
                <p className="mt-3 max-w-lg font-sans text-sm leading-relaxed text-stone-600">
                  {PILOT_ITERATIONS[0].note}
                </p>
                <div className="mt-6 overflow-hidden rounded-[24px] border border-outline-variant/20 bg-stone-950 shadow-[0_18px_40px_rgba(28,25,23,0.12)]">
                  <video
                    className="aspect-[4/3] w-full object-cover md:aspect-[16/10]"
                    src={pilotConsultationVideo}
                    poster={PILOT_ITERATIONS[0].src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                  />
                </div>
              </figcaption>
            </figure>
            <div className="md:col-span-5 grid gap-4">
              {PILOT_ITERATIONS.slice(1).map((iteration) => (
                <figure
                  key={iteration.label}
                  className="bg-white p-3 sm:p-4 border border-outline-variant/20 shadow-sm"
                >
                  <div className="aspect-square overflow-hidden bg-surface-container-low">
                    <img
                      className="h-full w-full object-cover"
                      src={iteration.src}
                      alt={`Pilot concept ${iteration.label.toLowerCase()}`}
                      loading="eager"
                    />
                  </div>
                  <figcaption className="pt-4">
                    <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-primary">
                      {iteration.label}
                    </span>
                    <p className="mt-2 font-sans text-sm leading-relaxed text-stone-600">
                      {iteration.note}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  </motion.div>
);

const ResearchPage = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="max-w-[1440px] mx-auto px-5 pt-16 sm:px-8 sm:pt-20 md:px-16 md:pt-24"
  >
    <header className="mb-20 sm:mb-24 md:mb-32">
      <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-12">
        <div className="md:col-span-7 md:pl-[10%]">
          <h1 className="max-w-4xl italic text-5xl leading-tight text-stone-900 sm:text-6xl md:text-8xl">
            Built with communities, grounded in research.
          </h1>
          <div className="mt-12 flex flex-col gap-12 items-baseline">
            <p className="max-w-xl text-xl leading-relaxed text-stone-600 sm:text-2xl">
              Our methodology bridges the gap between large-scale data and
              hyper-local nuance. By structuring disagreement, we find the path
              to collective progress.
            </p>
          </div>
        </div>
        <figure className="md:col-span-5 relative overflow-hidden rounded-[28px] border border-outline-variant/20 bg-surface-container-low shadow-[0_24px_70px_rgba(28,25,23,0.12)]">
          <div className="aspect-[4/5] overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src={researchWorkshopImage}
              alt="Workshop session used for dataset creation and evaluation"
              loading="eager"
            />
          </div>
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/70 to-transparent p-6">
            <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-white/70">
              Dataset Creation Workshop
            </span>
            <p className="mt-3 max-w-sm text-xl italic leading-snug text-white">
              Research artifacts came from real sessions, not synthetic proxy
              behavior.
            </p>
          </figcaption>
        </figure>
      </div>
    </header>

    <section className="mb-24 grid grid-cols-1 gap-6 md:mb-32 md:grid-cols-12 md:gap-8">
      <div className="md:col-span-8 bg-white p-8 sm:p-10 flex flex-col justify-between border border-outline-variant/10">
        <div>
          <span className="font-sans text-xs uppercase tracking-widest text-primary mb-4 block">
            Community Evaluation
          </span>
          <h2 className="text-3xl mb-8">Alignment Gains through Iteration</h2>
        </div>
        <div className="flex flex-col gap-8">
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="font-sans text-sm uppercase">
                Baseline Sentiment
              </span>
              <span className="font-sans text-lg">40%</span>
            </div>
            <div className="w-full h-8 bg-surface-container-low overflow-hidden">
              <div className="h-full bg-outline-variant w-[40%]" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="font-sans text-sm uppercase text-tertiary">
                Post-Consultation Alignment
              </span>
              <span className="font-sans text-lg text-tertiary">90%</span>
            </div>
            <div className="w-full h-12 bg-tertiary-container overflow-hidden">
              <div className="h-full bg-tertiary w-[90%]" />
            </div>
          </div>
        </div>
      </div>
      <div className="md:col-span-4 bg-surface-container-low p-8 sm:p-10">
        <span className="font-sans text-xs uppercase tracking-widest text-primary mb-4 block">
          Identity Matrix
        </span>
        <h2 className="text-3xl mb-12">Participant Diversity</h2>
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: 20 }).map((_, index) => (
            <div
              key={index}
              className={cn(
                'aspect-square bg-primary rounded-full',
                index % 3 === 0 ? 'opacity-100' : 'opacity-20',
              )}
            />
          ))}
        </div>
        <div className="mt-8 space-y-4">
          <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
            <span className="font-sans text-xs uppercase">
              Representation Index
            </span>
            <span className="font-sans text-sm font-bold">0.9</span>
          </div>
        </div>
      </div>
    </section>

    <section className="mb-32 md:mb-40">
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-8">
        <h2 className="text-4xl sm:text-5xl">Academic Foundation</h2>
        <div className="flex gap-6">
          <a
            href="https://mid-space.one/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-sm uppercase tracking-widest border-b-2 border-tertiary pb-1 flex items-center gap-2 group"
          >
            More on Research
            <ArrowUpRight
              size={16}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </a>
        </div>
      </div>
      <div className="space-y-16">
        {[
          {
            year: '2025',
            venue: 'Conference',
            title:
              'LIVS: A Pluralistic Alignment Dataset for Inclusive Public Spaces',
            desc:
              'Introducing the Local Intersectional Visual Spaces (LIVS) dataset, a benchmark for multi-criteria alignment developed through a two-year participatory process.',
            url: 'https://proceedings.mlr.press/v267/mushkani25a.html',
          },
          {
            year: '2025',
            venue: 'Journal',
            title:
              'WeDesign: Generative AI-Facilitated Community Consultations for Urban Public Space Design',
            desc:
              'Examining how generative text-to-image methods integrated into the WeDesign platform support equitable consultations and iterative dialogue.',
            url: 'https://arxiv.org/abs/2508.19256',
          },
          {
            year: '2025',
            venue: 'Conference',
            title: 'Co-Producing AI: Toward an Augmented, Participatory Lifecycle',
            desc:
              'A fundamental re-architecture of the AI production pipeline centering co-production, diversity, and multidisciplinary collaboration.',
            url: 'https://arxiv.org/abs/2508.00138',
          },
        ].map((paper, index) => (
          <a
            key={index}
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col md:grid md:grid-cols-12 gap-6 group cursor-pointer border-t border-outline-variant/20 pt-8"
          >
            <div className="md:col-span-2">
              <span className="font-sans text-xs uppercase text-stone-400">
                {paper.venue} / {paper.year}
              </span>
            </div>
            <div className="md:col-span-7">
              <h3 className="text-3xl mb-4 group-hover:text-primary transition-colors">
                {paper.title}
              </h3>
              <p className="font-sans text-sm text-stone-600 max-w-2xl leading-relaxed">
                {paper.desc}
              </p>
            </div>
            <div className="md:col-span-3 flex md:justify-end items-center gap-4">
              <span className="font-sans text-xs uppercase tracking-tighter bg-surface-container-high px-3 py-1">
                Open Access
              </span>
              <ArrowUpRight
                size={18}
                className="text-stone-400 group-hover:text-primary"
              />
            </div>
          </a>
        ))}
      </div>
    </section>
  </motion.div>
);

export default function App() {
  const { page, navigateToPage } = usePageRouting();

  useSeo(page);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activePage={page} navigateToPage={navigateToPage} />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {page === 'overview' && <OverviewPage navigateToPage={navigateToPage} />}
          {page === 'pilot' && <PilotPage />}
          {page === 'research' && <ResearchPage />}
        </AnimatePresence>
      </main>
      <Footer navigateToPage={navigateToPage} />
    </div>
  );
}
