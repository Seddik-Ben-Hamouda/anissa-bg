# ANISSA BG — Frontend

React + Vite + Tailwind CSS v4 frontend for the ANISSA BG website, wired to the
`anissa-bg-backend` API (Hono / Cloudflare Workers / Supabase).

## Setup

```bash
npm install
npm run dev
```

The site runs at `http://localhost:5173`.

## Connecting to the backend

The API base URL is read from `VITE_API_URL` in `.env`. It's already set to:

```
VITE_API_URL=http://127.0.0.1:8787
```

Make sure `anissa-bg-backend` is running locally (`npm run dev` in that
project, on port `8787`) before loading the frontend — every page that
pulls live data (Shop, product pages, and all four request forms) talks
directly to it.

When you deploy the backend to Cloudflare, update `.env` (and set the
same variable in your hosting provider's environment settings) to point
at the production Worker URL instead, e.g.:

```
VITE_API_URL=https://anissa-bg-backend.<your-subdomain>.workers.dev
```

## What's wired to the live backend vs. static

- **Shop** (`/shop`, `/shop/:slug`) — fully live: categories and products
  are fetched from the API. Filtering by category works against real data.
- **Le Féminin Sacré** (`/collection/le-feminin-sacre/:slug`) — the
  storytelling copy (symbolism, names) is written directly into
  `src/data/feminineSacreLooks.js`, since that's fixed editorial content.
  Each look page *also* tries to fetch a matching product by slug (e.g.
  `la-robe-de-la-graine`) — once you add these 14 dresses in the admin
  dashboard with matching slugs, their real photos, materials, and
  availability will appear automatically.
- **Wearable Healing Art** and **Sacred Space Art** — static editorial
  pages from `src/data/`, since these are collection categories described
  narratively by the client rather than individual purchasable products.
  "Request a piece" on these pages links to the Custom Creation form.
- **All four request forms** (Request This Piece, Custom Creation,
  Threads of Light Session Inquiry, Contact) — fully live, posting
  directly to the backend's public endpoints.

## Still needed from the client

- **The 14 dress product entries** in the database (via the admin
  dashboard, once built, or directly via SQL) — using the slugs already
  referenced in `src/data/feminineSacreLooks.js` so the live product data
  connects automatically.
- **Real photography** for every product, uploaded via the R2 image
  upload endpoint. Until then, pages show a placeholder frame rather than
  a photo.
- **The exact "About" text** — the email thread only forwarded a summary,
  not the full body. `src/pages/About.jsx` has a structural placeholder
  based on that summary; swap in Anissa's real wording once you have it.

## Project structure

```
src/
├── components/     Navbar, Footer, buttons, form fields, placeholder frames
├── data/           Static editorial copy (collections, Threads of Light)
├── lib/api.js      Fetch wrapper for every backend endpoint
├── pages/          One file per route
├── App.jsx         Route definitions
└── main.jsx        Entry point
```

## Design tokens

Colors, fonts, and other design tokens live in `src/index.css` under
`@theme` (Tailwind v4's CSS-based config) — edit them there rather than
in a separate `tailwind.config.js`.
