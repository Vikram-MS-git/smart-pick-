# SmartPick — AI-Powered PC Builder & Gadget Recommendation System (Frontend MVP)

A polished, dark-themed React + Vite frontend for an MCA mini project. No backend,
no database, no auth, no real AI — everything runs on mock data so it's fully
demoable offline.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Pages

- `/` — Home: hero, category cards, AI prompt box, why-SmartPick, footer
- `/recommendation` — requirement form → mock AI-ranked results (Best Overall / Best Value / Best Performance)
- `/pc-builder` — purpose + budget slider, component picker, live compatibility engine, build summary
- `/laptops`, `/mobiles`, `/earphones` — searchable, filterable, sortable catalogs (6 products each)
- `/compare` — pick 2–3 products, spec comparison table, SmartPick Winner banner
- `/product/:id` — product detail page (destination for "View Details")

## Structure

```
src/
├── components/     Navbar, Footer, ProductCard, CategoryCard, AIRecommendationCard,
│                   SearchBar, MatchRing (signature AI-match ring)
├── context/         CompareContext (cross-page "Add to Compare" selection)
├── pages/           Home, Recommendation, PCBuilder, Laptops, Mobiles, Earphones,
│                   ProductListing (shared listing logic), Compare, ProductDetail, NotFound
├── data/            products.js (mock catalog), pcComponents.js (mock parts + compatibility rules)
├── utils/           mockRecommend.js (scoring engine), parsePrompt.js (keyword parser for hero textarea)
├── styles/          global.css (design tokens: dark navy + blue/purple gradient theme)
├── App.jsx
└── main.jsx
```

## Designed for future extension

All "AI" and "data" logic is isolated behind plain functions and a single
`data/` folder:

- Swap `data/products.js` and `data/pcComponents.js` for API calls to a
  Node.js + MongoDB backend without touching any component.
- Swap `utils/mockRecommend.js` and `utils/parsePrompt.js` for a real
  Python/Scikit-learn/NLP recommendation service — the calling pages only
  expect the same return shape.
- `CompareContext` can be upgraded to sync with a backend cart/session
  without changing how pages consume it.

## Tech stack

React 19 + Vite, React Router DOM, plain CSS (no framework), mock data only.
