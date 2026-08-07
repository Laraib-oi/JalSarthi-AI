# JalSarthi Platform

Frontend foundation for **JalSarthi AI** — an intelligent virtual assistant
concept for the Ministry of Jal Shakti, built for a Smart India Hackathon
prototype.

This repository contains **only the frontend foundation**: a landing page,
design system, and project structure. No backend, AI, authentication, or
API integration is implemented yet — see [Out of scope](#out-of-scope).

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
  lib/            Framework-agnostic utilities (cn class-merge helper)
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

## Out of scope

By design, this foundation does **not** include:

- Backend service (FastAPI is planned, not started)
- AI / RAG / Gemini integration
- Authentication
- Real chat logic or API calls

These land in later milestones once the frontend shell is approved.
