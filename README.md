# WeDesign+

WeDesign+ is a public-facing editorial site for visual civic consultation.

Primary site:
- `https://www.wedesign.plus/`

The site presents WeDesign+ through three core pages:
- `Overview` — the main landing page and methodology narrative
- `Pilot` — the Sainte-Marie pilot case study
- `Research` — the academic and participatory research foundation

## What Matters Here

- This repo is for the website experience, not a generic product prototype README.
- The canonical domain is `https://www.wedesign.plus/`.
- The Vercel deployment exists, but it should defer to the main domain for indexing.
- Search indexing is supported through:
  - [index.html](/Users/rsdmu/Desktop/cocoonlab/wedesignplus/index.html)
  - [public/robots.txt](/Users/rsdmu/Desktop/cocoonlab/wedesignplus/public/robots.txt)
  - [public/sitemap.xml](/Users/rsdmu/Desktop/cocoonlab/wedesignplus/public/sitemap.xml)
  - [vercel.json](/Users/rsdmu/Desktop/cocoonlab/wedesignplus/vercel.json)
  - [src/lib/site.ts](/Users/rsdmu/Desktop/cocoonlab/wedesignplus/src/lib/site.ts)

## Local Development

Requirements:
- Node.js 20+
- npm

Run locally:

```bash
npm install
npm run dev
```

Default local URL:
- `http://localhost:3000`

## Scripts

- `npm run dev` starts the local development server
- `npm run build` creates the production build in `dist/`
- `npm run preview` serves the production build locally
- `npm run typecheck` runs TypeScript checks
- `npm run verify` runs typecheck plus production build

## Content and Structure

Main app files:
- [src/App.tsx](/Users/rsdmu/Desktop/cocoonlab/wedesignplus/src/App.tsx) — page structure, routing, CTA behavior, SEO updates
- [src/index.css](/Users/rsdmu/Desktop/cocoonlab/wedesignplus/src/index.css) — global styling
- [src/lib/site.ts](/Users/rsdmu/Desktop/cocoonlab/wedesignplus/src/lib/site.ts) — routes, labels, canonical metadata

Key public assets:
- [public/robots.txt](/Users/rsdmu/Desktop/cocoonlab/wedesignplus/public/robots.txt)
- [public/sitemap.xml](/Users/rsdmu/Desktop/cocoonlab/wedesignplus/public/sitemap.xml)
- [public/social-preview.jpg](/Users/rsdmu/Desktop/cocoonlab/wedesignplus/public/social-preview.jpg)

Page visuals:
- `src/assets/pages/overview/`
- `src/assets/pages/pilot/`
- `src/assets/pages/research/`

Brand assets:
- `src/assets/brand/`
- `public/favicon-16x16.png`
- `public/favicon-32x32.png`
- `public/apple-touch-icon.png`

## Deployment Notes

- Production should resolve to `https://www.wedesign.plus/`
- Vercel should remain configured to redirect its project hostname to the main domain
- If the main domain ever changes, update:
  - [src/lib/site.ts](/Users/rsdmu/Desktop/cocoonlab/wedesignplus/src/lib/site.ts)
  - [index.html](/Users/rsdmu/Desktop/cocoonlab/wedesignplus/index.html)
  - [public/robots.txt](/Users/rsdmu/Desktop/cocoonlab/wedesignplus/public/robots.txt)
  - [public/sitemap.xml](/Users/rsdmu/Desktop/cocoonlab/wedesignplus/public/sitemap.xml)
  - [vercel.json](/Users/rsdmu/Desktop/cocoonlab/wedesignplus/vercel.json)

## Maintenance Rule

Keep this README focused on the live website:
- what the site is
- where it lives
- what pages it contains
- how to run it
- what to update when routes, SEO, branding, or the domain change

Avoid filling it with product history, unused implementation details, or old prototype notes.
