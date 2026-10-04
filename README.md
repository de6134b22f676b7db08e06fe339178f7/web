# websport.com.au

Marketing site for Websport: websites and apps for sports clubs. Next.js 16 (App Router), static export, Tailwind v4.

- `npm run dev` for local development.
- `npm run build` runs `scripts/optimize-images.mjs` first (WebP/JPG variants for everything in `public/work/**`), then exports to `out/`.
- `npm run og` regenerates `public/og.png` from the local Archivo subset (`public/fonts/archivo-sub.woff2`); no network. (v3 wants Instrument Serif OG images, DESIGN.md 6.4: pending.)
- Design spec: `DESIGN.md` v3. Foundation APIs: `.agents-notes/v3-foundation.md`.
- Case studies live in `src/content/work/`. Add a file, register it in `index.ts`, drop screenshots in `public/work/<slug>/`.
