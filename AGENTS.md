# AGENTS.md

## Cursor Cloud specific instructions

This is a **Next.js 14** fashion influencer landing page (single app, no backend/database).

### Key commands

See `package.json` scripts and `README.md` for standard commands (`npm run dev`, `npm run build`, `npm run lint`).

### Non-obvious caveats

- **Recursive postinstall**: `package.json` has a `postinstall` script that runs `npm install --legacy-peer-deps`, causing infinite recursion. Always install with `npm install --legacy-peer-deps --ignore-scripts` to avoid this.
- **ESLint config**: The repo ships an `eslint.config.mjs` (flat config) but Next.js 14's `next lint` does not recognize it. A `.eslintrc.json` with `"extends": "next/core-web-vitals"` is needed for `npm run lint` to run non-interactively.
- **Build failure**: `app/shop/page.tsx` is an empty file (pre-existing), causing `npm run build` to fail with a type error. The dev server (`npm run dev`) works fine since it compiles pages on demand.
- **Dev server**: Runs on port 3000 by default (`npm run dev` or `npx next dev -p 3000`).
