# AGENTS.md

Guidance for coding agents working in this repository.

## Project overview

- Stack: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion.
- Package manager: `npm` (lockfile is `package-lock.json`).
- Path alias: `@/*` maps to `app/*` (see `tsconfig.json`).

## Repository layout

- `app/page.tsx`: Home page composition.
- `app/layout.tsx`: Root layout and metadata.
- `app/components/*`: Page sections and reusable UI pieces.
- `app/components/ui/*`: Shared UI components.
- `app/globals.css`: Global styles and theme variables.
- `app/lib/utils.ts`: Utility helpers (including `cn()`).

## Local development

- Install dependencies: `npm install --legacy-peer-deps`
- Start dev server: `npm run dev`
- Lint: `npm run lint`
- Production build check: `npm run build`
- Production start: `npm run start`

## Coding guidelines

- Use TypeScript and keep strict typing intact; avoid `any` unless unavoidable.
- Follow existing file-local style (quote style, import ordering, formatting) instead of forcing broad rewrites.
- Keep components focused and composable; place reusable UI in `app/components/ui`.
- Use Tailwind utility classes for styling; prefer extending existing patterns over introducing new styling systems.
- Use `cn()` from `app/lib/utils.ts` for conditional/merged class names.
- Add `"use client"` only when a component actually needs client-side hooks/events.
- Prefer `@/` imports when they improve readability for app-internal modules.

## UI and UX expectations

- Preserve responsive behavior across mobile/tablet/desktop.
- Keep animations purposeful and performant.
- Maintain semantic HTML and accessibility basics (headings, labels, keyboard focus, alt text where relevant).

## Testing and validation

- There is no dedicated unit test suite currently; use targeted validation:
  - Run `npm run lint` for static checks.
  - Run `npm run build` for integration-level compile checks on non-trivial changes.
- For visual changes, run `npm run dev` and manually verify the affected page(s) in a browser.
- Do not run unrelated broad checks when a narrower command validates the change.

## Dependency and scope discipline

- Avoid adding dependencies unless required for the task.
- If adding a dependency, use the latest stable version and keep changes minimal.
- Do not refactor unrelated files while implementing focused fixes/features.

## Cursor Cloud specific instructions

- Keep changes small and reviewable.
- Before finalizing, summarize:
  - What changed.
  - Which commands were run.
  - What manual verification was performed (for UI work).
- For UI-affecting changes, include at least one screenshot and one short demo recording in the final report.
