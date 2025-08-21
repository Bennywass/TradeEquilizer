
# TradeEqualizer — Sprint Board (.md)

**Product Goal:** Make in-person trades faster and fairer with a *match-first* engine (want lists + binder values) and *event mode* for LGS.

**Owner:** Arcane Foundry LLC  

**Target Stack:** Next.js (App Router), Node/TS, Supabase (Auth/DB), Stripe, Scryfall (cards), TCGplayer API (prices), PDFKit/resvg (receipts), Plausible

---

## KPIs
- **Activation:** ≥60% of signups add ≥1 item to **Inventory** *and* **Want List** within 24h
- **Match Rate:** ≥70% of sessions show ≥1 suggested trade (coverage-first)
- **Trade Completion:** ≥25% of suggested trades accepted
- **LGS pilots:** 3 stores using **Event Mode** within 30 days of launch
- **Free→Pro conversion:** ≥5%

---

## Epics
1. **Catalog & Pricing** — local card catalog + price snapshots (TCGplayer)
2. **Inventory & Want List** — add/search/import CSV; priorities; constraints
3. **Match Engine** — coverage-first suggestions + fairness + “make-it-even”
4. **Trade Flow** — QR connect, proposal review, **receipt PDF**, inventory updates
5. **Event Mode (LGS)** — room code, visibility scope, kiosk “Match Board”
6. **Foundations** — Auth, billing, telemetry, legal, ToS/privacy

---

## Data Model (v1)
```ts
User { id, name, email }
Item { id, game, name, set, number, scryfallId?, tcgplayerId? }
Inventory { userId, itemId, qty, cond: "NM"|"LP"|"MP"|"HP", foil: boolean, tradable: boolean }
Want { userId, itemId, qty, minCond, foilOk, priority: 3|2|1 }
Price { itemId, currency: "USD", market, low, high, asOf }
Event { id, name, code, createdBy }
EventMember { eventId, userId, visibility: "private"|"event" }
Trade { id, aUserId, bUserId, itemsFromA, itemsFromB, valueA, valueB, coverageScore }
```

---

## Definition of Done (DoD)
- Tests pass in CI; **e2e smoke** on QR → match → receipt
- No PII in logs; **rate limits** on price pulls
- Accessibility check (labels, focus order); Core Web Vitals green on landing
- ToS/Privacy published; **“compatible with TCGs; not affiliated”** disclaimer
- Observability: basic event tracking (signups, adds, matches, accept)

---

## Sprint 0 — Foundations & Catalog (Aug 25, 2025 → Aug 31, 2025)
**Goals:** Repo, auth, card catalog, basic UI scaffold.

- [ ] Repo init, envs, CI (GitHub Actions), Prettier/ESLint
- [ ] Supabase project: Auth (email link), DB tables (User/Item/Inventory/Want/Price)
- [ ] **Scryfall bulk import** job (daily) → `Item` table; search index
- [ ] Pricing: request **TCGplayer API** keys; stub daily price snapshot
- [ ] App shell (Next.js): landing, dashboard placeholders
- [ ] Legal: ToS/Privacy skeleton, “not affiliated” footer
- [ ] Analytics: Plausible + event hooks scaffold

**Acceptance Criteria**
- Fresh clone → `pnpm i && pnpm dev` boots
- Search returns card hits from local `Item` table in <150ms (dev)
- Test user can sign in/out

---

## Sprint 1 — Inventory + Want List (Sep 01, 2025 → Sep 14, 2025)
**Goals:** CRUD inventory, **Want List** with priorities/constraints, CSV import.

- [ ] Inventory CRUD: add/search/edit; **tradable** toggle; condition & foil
- [ ] Want List CRUD: qty, **minCond**, **foilOk**, **priority (3/2/1)**
- [ ] CSV import (TCGplayer export template) → map to `Inventory`
- [ ] Price snapshot worker (daily) with rollback; cache layer
- [ ] UI: Inventory table, Want List table; empty states & tips
- [ ] Unit tests (models/utils); integration tests for import

**Acceptance Criteria**
- User can import a CSV (100+ rows) and see items in inventory
- Want List supports priorities & constraints
- Daily price snapshot stored; API rate usage within budget

---

## Sprint 2 — Match Engine + Trade Flow (Sep 15, 2025 → Sep 28, 2025)
**Goals:** **QR connect**, **coverage-first suggestions**, receipt PDF.

- [ ] QR connect: short-lived codes to open 1:1 trade session
- [ ] **Match-first algorithm** (greedy MVP): Wants ↔ Inventory, priority × value
- [ ] Fairness guardrail (±5% or ±$1.50); **“make-it-even”** fillers
- [ ] Trade proposal UI: 3–5 candidates; coverage badges
- [ ] **Receipt PDF** (both sides; optional email), inventory auto-update on accept
- [ ] E2E smoke (Playwright): QR → suggest → accept → receipt

**Acceptance Criteria**
- Two test users produce ≥1 suggestion in <3s with at least one **Must** satisfied
- PDF receipt generates under 1s; values and quantities correct
- Inventory updates reflect the trade upon acceptance

---

## Sprint 3 — Event Mode (LGS) + Billing (Sep 29, 2025 → Oct 12, 2025)
**Goals:** Event rooms, kiosk, Stripe plans, launch beta.

- [ ] Event room: create/join via **code**; per-user visibility
- [ ] “Nearby matches” list scoped to event; opt-in
- [ ] **Kiosk/TV “Match Board”**: anonymous prompts to connect (rotating)
- [ ] Stripe: Free vs **Pro ($5/mo)** vs **LGS ($15–$19/mo)**
- [ ] Onboarding emails (3 steps); feedback form; bug report link
- [ ] Beta launch with 3 LGS; collect NPS and bug list

**Acceptance Criteria**
- Handle 50 users in an event with sub‑second “nearby matches” queries
- Successful Stripe checkout for Pro & LGS; entitlements enforced
- At least one LGS runs a real event with kiosk view

---

## Risks & Mitigations
- **Price API limits** → daily snapshots + user-supplied CSV fallback
- **Latency on matches** → precompute per-user want/inventory sets; in-memory cache
- **Scope creep** → cap formats; no scanner v1

---

## Launch Checklist
- [ ] Landing with 30‑sec GIF + pricing
- [ ] Docs: import templates, privacy/ToS, support email
- [ ] Store pilot agreements (60‑day free), QR flyers
- [ ] Issue templates + status page link
