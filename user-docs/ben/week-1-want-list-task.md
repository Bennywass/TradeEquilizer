# Week 1 (Oct 5–11) — Want List CRUD (Learning-Focused Task Sheet)

## Goal
Build a basic Want List feature so a user can add, edit, and delete MTG card wants with a priority (1=Must, 2=Want, 3=Nice). Keep scope small, focus on learning the stack and patterns.

## Context
- Matches the weekly plan: tasks.md §6; design.md Wants + API (Wants)
- Relies on: Supabase auth already wired; routing in Next.js App Router; Scryfall search page exists as reference for UI patterns

### Existing implementation to study (already in repo)
- Database schema for wants:
  - `supabase/migrations/001_initial_schema.sql` (table `wants`, priority 1–3)
  - `supabase/migrations/002_indexes.sql` (indexes for wants by user, priority, item)
  - `supabase/migrations/003_rls_policies.sql` (row‑level security: users manage their own wants)
  - `supabase/migrations/004_functions_triggers.sql` (usage counters include wants)
  - `supabase/seed.sql` (sample wants for test users)
- API route patterns:
  - `src/app/api/scryfall/route.ts` (request parsing, errors, responses, caching)
- UI patterns:
  - `src/app/trades/search/page.tsx` (list rendering, debounced fetch, responsive layout)
  - `src/components/ui/Button.tsx` (variants/sizes/hover/active)

## Outcomes (Deliverables)
- API endpoints: GET/POST/PUT/DELETE at `/api/wants`
- UI page at `/wants` with a simple list/table
- Create/Edit/Delete flows with basic validation (quantity > 0, priority ∈ {1,2,3})
- Priority selector component (1/2/3) with short descriptions
- Empty state with guidance on how to add cards
- Short README section (or inline doc) explaining how to use the feature and where the code lives

## Success Criteria (Review Checklist)
- [ ] Authenticated users can create a want with quantity and priority
- [ ] Users can edit and delete a want they created
- [ ] Invalid inputs are rejected with clear messages
- [ ] The `/wants` page loads on mobile and desktop (responsive)
- [ ] Code follows existing patterns (file layout, naming, hooks)
- [ ] Brief usage notes added to README (link to `/wants`)

## Suggested Milestones (Learning-Oriented)
1) Types and data shape (1h)
- Define a minimal `Want` type (id, itemId, quantity, priority)
- Decide where it lives: `src/types/`
  - Repo references:
    - Existing Supabase types: `src/types/supabase.ts`
    - Shared type barrel: `src/types/index.ts`
    - Auth context (shape of `user`): `src/contexts/AuthContext.tsx`

2) API routes (2h)
- Create `/api/wants` for GET/POST
- Create `/api/wants/[id]` for PUT/DELETE
- Validate input (zod or simple checks)
- In-memory or Supabase stub is okay for first pass; pick one and document
  - Repo references:
    - API route style & error handling: `src/app/api/scryfall/route.ts`
    - Middleware auth/session pattern: `src/lib/supabase/middleware.ts`
    - Server/client Supabase client usage: `src/lib/supabase/server.ts`, `src/lib/supabase/client.ts`

3) UI page (2h)
- New route: `src/app/wants/page.tsx`
- Render list of wants; add form (inline or modal) to create
- Add edit and delete actions (optimistic updates optional)
  - Repo references:
    - UI patterns for search/results grid: `src/app/trades/search/page.tsx`
    - Buttons (variants, sizes, hover states): `src/components/ui/Button.tsx`
    - Layout and globals: `src/app/layout.tsx`, `src/app/globals.css`

4) Polish + docs (1h)
- Empty state, error messages, simple loading
- Add a short section in `README.md` (How to manage your want list)
  - Repo references:
    - README structure to follow: `README.md`
    - Database schema notes (for future persistence): `docs/database-schema.md`

## Nice-to-Haves (Optional)
- Search integration: pick a card from search results and prefill the want form
- Simple client-side cache (SWR) for the wants list
- Toast notifications on success/error

## References (Where to Start)
- Spec: `.kiro/specs/trade-equalizer-platform/tasks.md` §6
- Design: `.kiro/specs/trade-equalizer-platform/design.md` (Wants, API Endpoints)
- Code examples: `src/app/trades/search/page.tsx` (UI patterns), `src/app/api/scryfall/route.ts` (API route style)

## Tips
- Keep the UI simple (one page, one form). Ship small.
- Prefer explicit naming and small components over cleverness.
- If blocked for >30 minutes, leave a note in the PR with what you tried.

---

## Documentation Links (Official)
- Next.js App Router (Pages & Routing): https://nextjs.org/docs/app
- Next.js API Routes (App Router): https://nextjs.org/docs/app/building-your-application/routing/router-handlers
- Next.js Middleware: https://nextjs.org/docs/app/building-your-application/routing/middleware
- TypeScript in Next.js: https://nextjs.org/docs/app/building-your-application/configuring/typescript
- Supabase JavaScript Client (v2): https://supabase.com/docs/reference/javascript
- Supabase Auth (Email/password, OTP): https://supabase.com/docs/guides/auth
- Supabase Row Level Security (RLS): https://supabase.com/docs/guides/auth/row-level-security
- Supabase SQL Migrations: https://supabase.com/docs/guides/database
- Scryfall API (reference): https://scryfall.com/docs/api
