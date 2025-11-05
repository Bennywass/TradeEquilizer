## Frontend Pages and Intended Backend Endpoints

This document outlines the current frontend pages, their purpose, and the backend API endpoints Ben can implement to power them. All pages are wired via the global navigation (`src/components/AppNav.tsx`) and scaffolded under the Next.js App Router.

### Pages

- Home (`/`)
  - Marketing/entry page with auth shortcuts. Links to `Dashboard` or `Sign Up`.

- Dashboard (`/dashboard`)
  - Protected landing after auth. Shows basic user info. Future: recent trades, quick links.

- Search (`/trades/search`) and alias (`/cards/search`)
  - Discover cards and add to Trade List or Want List.
  - Currently queries existing routes: `GET /api/cards/search` with fallback `GET /api/scryfall`.

- Trade Builder (`/trades/builder`)
  - Compose left/right trade panes, view totals, and “equalize” suggestions.

- Inventory (`/inventory`)
  - Manage the user’s owned cards; import/export and edit quantities/conditions.

- Want List (`/wants`)
  - Track cards the user wants; used by search and trade builder.

- Pricing (`/pricing/market`)
  - View current market prices and sync status.

### Existing API Routes

- `GET /api/cards/search` — local catalog search (already present)
- `GET /api/scryfall` — proxy/fallback to Scryfall (already present)
- `GET /api/prices/market` — market pricing fetch (already present)

### Proposed API Endpoints to Implement

- Inventory
  - `GET /api/inventory` — list current user inventory
  - `POST /api/inventory` — upsert inventory items (bulk and single)
  - `DELETE /api/inventory/:id` — remove an inventory item

- Want List
  - `GET /api/wants` — list current user want list
  - `POST /api/wants` — add/update wants
  - `DELETE /api/wants/:id` — remove an item from want list

- Trade Builder
  - `POST /api/trades/evaluate` — compute totals and suggest equalizers given two item lists
  - `POST /api/trades/save` — persist a composed trade (draft/final)
  - `GET /api/trades/:id` — retrieve a saved trade

- Pricing
  - `POST /api/prices/sync` — trigger background price sync (admin or queued)
  - `GET /api/prices/history?cardId=...` — historical price data for charts

### Integration Notes

- Auth: All protected pages use `ProtectedRoute` and Supabase session; APIs should validate user identity/server-side.
- Types: Centralize shared types in `src/types/` so FE/BE stay aligned.
- Pagination/filters: Prefer cursor-based pagination for search and lists.
- Rate limiting: Apply to search and scryfall-proxy endpoints.
- Errors: APIs should return structured errors `{ code, message }` for clean UX.

### Next Steps

1) Implement the proposed endpoints with Supabase RLS in mind.
2) Wire the UI buttons on Search, Inventory, Want List, and Trade Builder to their respective endpoints.
3) Add charts and last-sync indicators on Pricing.


