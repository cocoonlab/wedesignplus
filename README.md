# WeDesign+

WeDesign+ is a React and Vite prototype for visual civic consultation. The app combines an editorial product narrative with a Studio experience that generates concept directions from resident priorities.

## Release Posture

- Vercel-ready static build output in `dist/`
- Server-side concept generation through [api/generate-concept.ts](/Users/rsdmu/Desktop/cocoonlab/wedesignplus/api/generate-concept.ts)
- Security headers and cache rules defined in [vercel.json](/Users/rsdmu/Desktop/cocoonlab/wedesignplus/vercel.json)
- No provider key is exposed in the client bundle
- Deterministic local SVG visuals instead of external placeholder image services

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Motion
- Vercel Functions
- Google Gen AI SDK

## Local Development

### Prerequisites

- Node.js 20+
- npm

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file:

   ```bash
   cp .env.example .env.local
   ```

3. Add the server-side API key:

   ```bash
   GEMINI_API_KEY=your_server_side_api_key_here
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

The app runs on `http://localhost:3000`. During local development, Vite serves the frontend and a dev-only `/api/generate-concept` endpoint using the same validation and generation logic as production.

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | Yes for Studio generation | Server-side provider key used by the local dev API and deployed Vercel Function |
| `GEMINI_MODEL` | No | Overrides the model name. Defaults to `gemini-2.5-flash` |
| `DISABLE_HMR` | No | Set to `true` to disable Vite hot module reload during editing sessions |

If `GEMINI_API_KEY` is omitted, the site still renders, but Studio generation returns a clear server-side configuration error instead of exposing provider credentials in the browser.

## Scripts

- `npm run dev` starts the local Vite app with the development API endpoint
- `npm run build` creates a production build in `dist/`
- `npm run preview` serves the production build locally
- `npm run clean` removes the local build output
- `npm run typecheck` runs the TypeScript checker
- `npm run verify` runs the full local release check

## Vercel Deployment

### Required project settings

- Add `GEMINI_API_KEY` in Vercel Project Settings
- Optionally add `GEMINI_MODEL`

### Deployment flow

1. Create a preview deployment:

   ```bash
   vercel deploy
   ```

2. Review the preview deployment, especially the Studio interaction.

3. Promote only after preview validation passes:

   ```bash
   vercel deploy --prod
   ```

### What Vercel uses

- Static output directory: `dist`
- Serverless endpoint: `/api/generate-concept`
- Security headers: CSP, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and `X-Content-Type-Options`
- API caching: disabled for dynamic model responses

## Project Structure

```text
.
├── api/
│   └── generate-concept.ts
├── src/
│   ├── App.tsx
│   ├── components/
│   │   └── RootErrorBoundary.tsx
│   ├── index.css
│   ├── lib/
│   │   ├── studio-server.ts
│   │   ├── studio.ts
│   │   ├── utils.ts
│   │   └── visuals.ts
│   └── main.tsx
├── .env.example
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── vercel.json
└── vite.config.ts
```

## Verification

Run the release check locally:

```bash
npm run verify
```

For a production-grade deployment, also validate the Vercel preview after environment variables are configured.
