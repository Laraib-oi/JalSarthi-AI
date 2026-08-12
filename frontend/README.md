# JalSarthi AI

JalSarthi AI is a Ministry of Jal Shakti domain-inspired application for
bilingual water information and complaint-draft assistance. It is not an
official Government of India service.

The Next.js application includes a server-owned `/api/chat` route with:

- Grounded English/Hindi water Q&A using language-isolated, verified knowledge.
- Trusted source cards whose metadata is owned by the server.
- A deterministic Water Conservation Planner.
- A deterministic, session-only Complaint Draft Assistant with sensitive-detail redaction. Drafts are not submitted, routed, stored, or tracked.
- A static, verified official-source catalogue. It does not perform live web searches or fetches.

Normal grounded chat uses Gemini only when its server environment variable is
configured. Planner, complaint drafting, and official-source discovery do not
call Gemini.

The guided water-accumulating-pothole flow is isolated from normal chat. It
validates JPEG, PNG, and WebP images on the server, sends only sanitized image
bytes to the server-owned Gemini visual analyzer, and continues only when the
server determines that both a visible pothole and visible standing water are
present with sufficient confidence. The location step supports one-time,
user-initiated browser GPS or manual latitude, longitude, and area input. Both
paths use the same Leaflet/OpenStreetMap map, draggable marker, explicit
confirmation, and server-side Nominatim reverse-geocoding route. The final
preview shows the confirmed coordinates, the real reverse-geocoded address, and
the user-entered area when applicable. It ends at `READY FOR REVIEW` and
`NOT SUBMITTED`; there is no government submission API.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script              | Purpose                           |
| ------------------- | --------------------------------- |
| `npm run dev`       | Start the local dev server        |
| `npm run build`     | Production build                  |
| `npm run start`     | Serve the production build        |
| `npm run lint`      | Run ESLint                        |
| `npm run format`    | Format the codebase with Prettier |
| `npm run typecheck` | Run `tsc --noEmit`                |

## Tech stack

Next.js 15 (App Router) &middot; TypeScript (strict) &middot; Tailwind CSS
&middot; shadcn/ui primitives &middot; Framer Motion &middot; Lucide Icons

## Project structure

```
src/
  app/            Route entry points (layout, page, global styles)
  components/
    layout/       Navbar, Footer — persistent page chrome
    sections/     Hero, FeaturesSection, CtaSection — page-specific blocks
    shared/       Small reusable pieces (Logo, FeatureCard, WaveDivider)
    ui/           Low-level shadcn-style primitives (Button, Card)
  constants/      Static content: nav links, feature copy, site metadata
  hooks/          Reusable client hooks (e.g. useScrolled)
  lib/            Server-owned workflows, retrieval, source catalogue, AI provider, utilities
  styles/         Base/typography layer imported by app/globals.css
  types/          Shared TypeScript interfaces
public/           Static assets
```

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the full rationale behind
this structure and the package choices.

## Design system

Colors, type scale, spacing, radii, and shadows are defined once in
`tailwind.config.ts` as semantic tokens (`primary`, `ink`, `surface`, ...).
Components should always reach for a token class over an arbitrary value.

## Boundaries and data lifecycle

The application does not include:

- Live government APIs or real-time government data
- Complaint submission, routing, reference numbers, or tracking
- Authentication, database storage, persistence, or analytics
- Voice input

Selected images, analysis results, GPS/manual location, addresses, and drafts
remain in React/browser memory for the current session. They are not written to
localStorage, sessionStorage, cookies, IndexedDB, or a database. Confirmed
coordinates are sent through the server only for the explicit reverse-geocoding
request; they are not sent to a government service.

For normal chat, set `GEMINI_API_KEY` only in a local, untracked environment
file such as `.env.local`. Do not expose it to the client.
