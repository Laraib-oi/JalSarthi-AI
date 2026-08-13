# Architecture

## Folder structure and rationale

| Path                       | Purpose                                                                                                                                       |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/`                 | Next.js App Router entry points only — layout, page, metadata, global CSS. No business logic lives here.                                      |
| `src/components/layout/`   | Chrome that wraps every page: `Navbar`, `Footer`. Rendered once, from `layout.tsx`.                                                           |
| `src/components/sections/` | Page-specific composition blocks (`Hero`, `FeaturesSection`, `CtaSection`). Own their own layout, but source all copy/data from `constants/`. |
| `src/components/shared/`   | Small pieces reused across sections but too specific to be a `ui/` primitive (`Logo`, `FeatureCard`, `WaveDivider`).                          |
| `src/components/ui/`       | Framework-level primitives in the shadcn/ui convention (`Button`, `Card`). Unopinionated about copy or layout — composed by everything above. |
| `src/constants/`           | The only place literal copy and link targets live. Changing a headline or adding a nav item never touches JSX.                                |
| `src/types/`               | Shared interfaces (`FeatureItem`, `NavLink`, ...) so `constants/` and the components consuming them stay in sync at compile time.             |
| `src/hooks/`               | Client-side reusable behavior (`useScrolled`). Isolated so it's independently testable.                                                       |
| `src/lib/`                 | Server-owned deterministic workflows, retrieval, source catalogues, AI provider boundary, and shared helpers.                                 |
| `src/styles/`              | Base/typography CSS layer, imported once by `app/globals.css`, so global styling has a home that isn't a route file.                          |
| `public/`                  | Static assets served as-is. Empty for now — icon/OG-image work is a later pass.                                                               |

**Why this split:** every layer has exactly one reason to change. A copy
edit touches `constants/`. A visual-language change (color, radius, shadow)
touches `tailwind.config.ts`. A new primitive touches `ui/`. A new page
section touches `sections/` and nothing else. This is what keeps the
codebase safe to hand to another engineer without a walkthrough.

## Package choices

| Package                                                  | Why it's here                                                                                                                   |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `next`, `react`, `react-dom`                             | Framework baseline (App Router, Server Components by default).                                                                  |
| `typescript`, `@types/*`                                 | Strict typing across the codebase; `strict: true` and `noUncheckedIndexedAccess` are on.                                        |
| `tailwindcss`, `postcss`, `autoprefixer`                 | Utility-first styling engine and its required build pipeline.                                                                   |
| `tailwindcss-animate`                                    | Small keyframe/utility helpers that pair with shadcn/ui-style components.                                                       |
| `class-variance-authority`, `clsx`, `tailwind-merge`     | Standard shadcn/ui trio for typed component variants (`Button`) and safe conditional class merging.                             |
| `@radix-ui/react-slot`                                   | Enables the `asChild` pattern on `Button` (render as `<a>` without wrapping elements) — a Radix/shadcn convention.              |
| `lucide-react`                                           | Icon set specified for the feature cards and UI chrome; tree-shakeable, one import per icon.                                    |
| `framer-motion`                                          | Declarative, restrained scroll/entry animations (`whileInView`, page-load fades). No animation logic hand-rolled in components. |
| `eslint`, `eslint-config-next`, `eslint-config-prettier` | Lint baseline that matches Next.js conventions without fighting Prettier's formatting.                                          |
| `prettier`, `prettier-plugin-tailwindcss`                | Consistent formatting; the Tailwind plugin auto-sorts utility classes so diffs stay clean.                                      |

The application deliberately avoids extra state-management, data-fetching,
form, and persistence libraries. Its `/api/chat` route validates requests and
keeps retrieval, source metadata, planner guidance, and complaint-draft
generation server-owned. Gemini is used only for grounded normal chat when
configured; planner, complaint drafting, and official-source discovery are
deterministic and do not call it.

There is no live government API, complaint submission, complaint tracking,
authentication, or durable citizen-reporting database. JalSarthi AI is not an
official Government of India service.

The separate JalSarthi City Water Infrastructure Monitor currently has a
server-owned KartaView metadata ingestion layer. Lucknow is the initial
configured city, represented by a configurable center and small scan radius,
not an asserted administrative boundary. The ingestion records public
street-level imagery metadata and distinguishes capture time, provider-added
time, processing time, and discovery time. It reports latest available
imagery and new imagery discovered; it does not claim that KartaView imagery
is live. Checkpoint 8 uses an in-memory store behind a persistence interface,
so state resets when the server restarts. Checkpoint 9 adds server-only image
retrieval, Sharp validation, and a separate structured Gemini city-issue
screening path. The browser never accesses the provider directly; Ministry
intake and dashboard reads remain server-owned. A city issue is retained only
when the validated analysis has a supported category, usable source metadata, and
confidence of at least 0.80; source capture and analysis timestamps remain
separate. Accepted city issues can be forwarded server-side to the local
Demonstration Ministry Intake, which is not connected to the real Ministry of
Jal Shakti and performs no government submission. The intake is in-memory and
does not claim live or citywide Lucknow coverage; KartaView coverage remains
sparse and historical.

The `/ministry` route is a read-only Ministry Monitoring Console for the local
Demonstration Ministry Intake. It reads the safe summary and issue list from
`GET /api/ministry/issues`, supports explicit manual refresh, and does not run
polling or background monitoring in the browser. It is not the real Ministry
of Jal Shakti website and performs no government submission.

Checkpoint 12 adds a controlled demonstration simulation layer. The
`POST /api/city-monitor/simulate` route creates one deterministic, server-owned
Lucknow detection event with a `demo:` issue ID, structured issue analysis, and
automatic forwarding to the in-memory Demonstration Ministry Intake. The event
uses no external image and is labeled `DEMONSTRATION_SIMULATION` throughout the
API and dashboard. Repeating the event is idempotent and returns the existing
`JSM-LKO-XXXXXX` intake record. This path supplements KartaView; it does not
replace, fabricate, or present simulated observations as live external imagery.

The water-accumulating-pothole workflow is an isolated client flow backed by
the `/api/pothole/analyze` and `/api/pothole/reverse-geocode` routes. Server-side
image validation uses Sharp to decode and canonicalize supported JPEG and PNG
input before the server-owned Gemini visual analyzer receives it. The
server owns the eligibility threshold. GPS uses a single user-initiated
`getCurrentPosition()` call; manual coordinates and area remain in React state.
Both location methods converge on the same Leaflet/OpenStreetMap map, draggable
marker, confirmation, confirmed-coordinate reverse geocoding, and report
preview. The preview is deliberately the terminal state: `READY FOR REVIEW`
and `NOT SUBMITTED`. No government submission, tracking, or location/image
persistence exists.

## Design system approach

Every raw color, font size, radius, and shadow lives once in
`tailwind.config.ts` as a semantic token (`primary-600`, `ink-muted`,
`shadow-card`, ...). Components reference tokens, never hex values or
arbitrary pixel sizes — so a future rebrand or dark-mode pass changes one
file, not every component.

The recurring visual signature is a single flowing line (`WaveDivider`)
used between sections instead of a hard edge, plus a concentric-ripple
motif in the hero — both quiet nods to the platform's subject (water)
rather than generic decoration.

## Accessibility & performance baseline

- Semantic landmarks (`header`, `main`, `footer`, `nav`) and a skip-to-content link.
- Visible focus rings (`:focus-visible`) on every interactive element, not just buttons.
- `prefers-reduced-motion` is respected globally in `styles/typography.css`.
- All animation is `framer-motion`'s `whileInView`/mount transitions — nothing runs off-screen.
- Fonts load via `next/font/google` (self-hosted at build time, no runtime request to Google Fonts, no layout shift).
- No client component is marked `"use client"` unless it needs interactivity (`Navbar`, `FeatureCard`, `Hero`) — everything else stays a Server Component by default.
