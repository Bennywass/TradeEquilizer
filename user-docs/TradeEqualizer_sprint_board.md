# TradeEqualizer — Sprint Board (.md)

**Product Goal:** Make in-person trades faster and fairer with a *match-first* engine (want lists + binder values) and *event mode* for LGS.

**Owner:** Arcane Foundry LLC  

**Target Stack:** Next.js (App Router), Node/TS, Supabase (Auth/DB), Stripe, Scryfall (cards), TCGplayer API (prices), PDFKit/resvg (receipts), Plausible

---

## Prechecklist (Completed to Date)
- [x] Create environment example and document setup
  - Files: `.env.example`, updated `README.md`
- [x] Allow tracking of `.env.example` in git
  - File: `.gitignore` updated to ignore only live env files
- [x] Add card search wireframe page
  - Route: `/trades/search` (`src/app/trades/search/page.tsx`)
- [x] Add Scryfall search proxy with minimal rate limiting and caching
  - API: `src/app/api/scryfall/route.ts` (forwards params, ~100ms min delay, 5‑min cache)
- [x] Wire search page to live Scryfall queries with debounce and defaults
  - Debounce 350ms; default MTG results on load; image rendering when present
- [x] Improve button UX and responsiveness
  - Component: `src/components/ui/Button.tsx` (hover/active states, subtle elevation)
- [x] Gate wishlist/trade actions behind auth
  - Behavior: redirects to `/login` when not signed in
- [x] Simplify search UI per spec
  - Removed set/rarity filters; MTG‑focused placeholders and examples
- [x] Add dated weekly plan through Dec 15 aligned to P0
  - See: "Weekly Schedule (Oct 5 → Dec 15)" section below

Note: Sprint checklists below reflect the broader program; the dated weekly plan is the operational source of truth for current scope and sequencing.

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
3. **Match Engine** — coverage-first suggestions + fairness + "make-it-even"
4. **Trade Flow** — QR connect, proposal review, **receipt PDF**, inventory updates
5. **Event Mode (LGS)** — room code, visibility scope, kiosk "Match Board"
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
- ToS/Privacy published; **"compatible with TCGs; not affiliated"** disclaimer
- Observability: basic event tracking (signups, adds, matches, accept)

---

## Weekly Schedule (Oct 5 → Dec 15)

Each week targets ~6 hrs total (2 tasks for Josh, 1 for Ben). Spec references point to exact lines to start from.

### Week 1 — Oct 5–11: Search Foundation
- [ ] Josh — Task 4 (trimmed): MTG card catalog + DB search
  - Specs: `.kiro/specs/trade-equalizer-platform/tasks.md` §4; `design.md` → Card Catalog, API (Card Catalog)
  - Outcome: DB-backed search with indexes; Scryfall subset import (e.g., top EDHREC); CLI stub for daily job
- [ ] Ben — Task 6 (trimmed): Want list CRUD (basic priority field only)
  - Specs: tasks.md §6; design.md → Wants, API (Wants)
  - Subtasks:
    1. Create `Want` model types in `src/types/`
    2. Build API endpoints: GET/POST/PUT/DELETE `/api/wants`
    3. Add want list page at `/wants` with table/list view
    4. Implement priority selector (1=Must, 2=Want, 3=Nice to have)
    5. Add basic form validation for quantity and priority
    6. Create empty state with tips on adding cards
  - Outcome: Users can add/edit/delete wants with priority levels; advanced constraints deferred

### Week 2 — Oct 12–18: Pricing Integration
- [ ] Josh — Task 7 (trimmed): TCGplayer Market pricing (on-demand fetch + cache)
  - Specs: tasks.md §7; design.md → Price model, Caching, API (Pricing)
  - Outcome: USD-only Market price caching; daily snapshot stub
- [ ] Ben — Task 17: PWA basics (manifest, SW, cache core routes)
  - Specs: tasks.md §17; design.md → PWA Details
  - Subtasks:
    1. Update `public/manifest.json` with app icons, colors, display mode
    2. Install and configure `next-pwa` or workbox-webpack-plugin
    3. Create service worker with cache strategies:
       - Cache-first: images, fonts, static assets
       - Network-first: API calls with offline fallback
    4. Add install prompt component for iOS/Android
    5. Test offline functionality on mobile devices
    6. Add "Add to Home Screen" instructions
  - Outcome: App installable on mobile; works offline for basic functionality

### Week 3 — Oct 19–25: Matching Core
- [ ] Josh — Task 8 (trimmed): Matching algorithm MVP (greedy coverage-first)
  - Specs: tasks.md §8; design.md → Match Algorithm
  - Outcome: Simple matching respecting minimal printing constraints
- [ ] Ben — Task 22: Manual testing scripts (search → inventory → wants → matches)
  - Specs: tasks.md §22; design.md → Testing Strategy
  - Subtasks:
    1. Create test user accounts (signup flow)
    2. Document search flow: query → results → add to inventory/wants
    3. Document inventory management: add/edit/delete → price display
    4. Document want list flow: add/edit/delete → priority handling
    5. Create accessibility checklist (keyboard navigation, screen readers)
    6. Document mobile browser testing on iOS/Android
    7. Create bug report templates in `docs/testing/`
    8. Test on different screen sizes (phone, tablet, desktop)
  - Outcome: Complete testing playbook for current functionality

### Week 4 — Oct 26–Nov 1: secure Sessions
- [ ] Josh — Task 9 (MVP): Secure QR sessions (create/join with 2-min TTL)
  - Specs: tasks.md §9; design.md → Trading Sessions, API (Trading)
  - Outcome: QR generation + join flow; fake "connected" state (websockets later)
- [ ] Ben — Task 18 (MVP): Security middleware (headers, validation, simple rate limits)
  - Specs: tasks.md §18; design.md → Security Validation
  - Subtasks:
    1. Implement security headers middleware (`next.config.js` or middleware)
    2. Add input validation to API routes (zod/schema validation)
    3. Create simple Redis-based rate limiter for sensitive endpoints
    4. Add CORS configuration for production domains
    5. Implement PII scrubbing for logs (remove emails, names from console)
    6. Add request size limits and timeout configurations
    7. Create security configuration documentation
  - Outcome: Basic security posture aligned with spec requirements

### Week 5 — Nov 2–8: Trade Proposals
- [ ] Josh — Task 10: Trade proposals MVP (create + accept only)
  - Specs: tasks.md §10; design.md → Real-time engine
  - Outcome: Proposal creation + acceptance flow; skip reject/conflict UI
- [ ] Ben — Task 24: Onboarding/help basics (first-run tips + contextual help)
  - Specs: tasks.md §24; design.md → UX Enhancements
  - Subtasks:
    1. Create guided tour component for new users
    2. Add tooltips to key UI elements (search, add buttons)
    3. Build first-run modal: "Add your first card to inventory and wants"
    4. Create help documentation in `docs/`
    5. Add ? icon with contextual help links
    6. Implement progress indicators for multi-step flows
    7. Create email sequence templates (Welcome, tips, reminders)
    8. Add help search functionality
  - Outcome: Clear onboarding path reduces user confusion and increases activation

### Week 6 — Nov 9–15: Security Hardening
- [ ] Josh — Task 35: Security hardening (RLS review + QR limits)
  - Specs: tasks.md §35; design.md → Security & Data Protection
  - Outcome: RLS policy verification; QR rate limiting; PII-safe logging
- [ ] Ben — Task 29: Pilot scenario scripts (QR expiry, offline cache, free-tier limits)
  - Specs: tasks.md §29; design.md → Pilot Scenarios
  - Subtasks:
    1. Create QR token expiry test scripts (2-minute TTL verification)
    2. Document offline cache behavior and stale data indicators
    3. Test free-tier limits: 100 inventory items, 50 wants limits
    4. Create concurrent session conflict test procedures
    5. Document kiosk mode PII protection verification steps
    6. Build load test scenarios for 50+ users in events
    7. Create manual override testing procedures
    8. Document receipt generation accuracy verification
    9. Create pilot store testing package with flyers/codes
  - Outcome: Complete testing framework for LGS pilot deployment readiness

### Week 7 — Nov 16–22: Receipt Generation
- [ ] Josh — Task 12 (trimmed): PDF receipts (basic template + price version)
  - Specs: tasks.md §12; design.md → Completed Trades, Pricing Data
  - Outcome: Basic PDF with trade details; skip email delivery initially
- [ ] Ben — Task 19 (trimmed): Analytics basics (Plausible + 2 key events)
  - Specs: tasks.md §19; design.md → Analytics
  - Subtasks:
    1. Set up Plausible Analytics account and configure privacy settings
    2. Add pageview tracking to Next.js layout
    3. Implement custom event tracking hooks: `useAnalytics()`
    4. Track key events: 'signup_started', 'first_card_added', 'trade_completed'
    5. Create analytics dashboard for key metrics monitoring
    6. Add GDPR-compliant consent banner (if required)
    7. Document analytics tracking in privacy policy
    8. Set up conversion goals and funnel analysis
  - Outcome: Privacy-focused analytics tracking core user actions without PII

### Week 8 — Nov 23–29 (Holiday Light)
- [ ] Josh — Task 30 (part): Item reservation primitives OR Task 12 polish
  - Specs: tasks.md §30; design.md → Item Reservations
  - Outcome: Basic reservation system OR receipt enhancements
- [ ] Ben — Task 20 (skeleton): Legal pages (ToS/Privacy + disclaimer footer)
  - Specs: tasks.md §20; design.md → Legal
  - Subtasks:
    1. Create Terms of Service page with trading disclaimers
    2. Write Privacy Policy covering data collection, storage, deletion
    3. Add "Not affiliated with TCGs" disclaimer to all pages
    4. Create age verification component for new users
    5. Document data export/deletion procedures for GDPR
    6. Add footer links to legal pages site-wide
    7. Include liability limitations for trading activities
    8. Create legal review checklist for production launch
  - Outcome: Basic legal protection and compliance requirements met

### Week 9 — Nov 30–Dec 6: Integration Testing
- [ ] Josh — Task 37 (part): P0 integration test pass on core flows
  - Specs: tasks.md §37; design.md → SLOs, Pilot Scenarios
  - Outcome: End-to-end validation of primary user journeys
- [ ] Ben — Task 18 (add-ons): Rate-limit monitoring + alerts enhancement
  - Specs: tasks.md §18; design.md → Security/Monitoring
  - Subtasks:
    1. Create Redis monitoring dashboard for rate limit counters
    2. Set up alert thresholds for QR generation abuse (10/min/IP)
    3. Build API endpoint health checks (`/api/health`)
    4. Implement error rate monitoring and alerts
    5. Create security incident response procedures
    6. Document abuse detection patterns and responses
    7. Set up uptime monitoring for critical endpoints
    8. Create operations runbook for security incidents
  - Outcome: Comprehensive monitoring prevents abuse and ensures service availability

### Week 10 — Dec 7–13: Polish & Performance
- [ ] Josh — Task 11 + 21: Mobile UI polish + performance budgets (quick wins)
  - Specs: tasks.md §11, §21; design.md → Mobile-First, Performance Targets
  - Outcome: Touch optimization + performance improvements
- [ ] Ben — Task 33 (scaffold): Notification preferences UI (delivery later)
  - Specs: tasks.md §33; design.md → Notifications
  - Subtasks:
    1. Create notification preferences page (`/settings/notifications`)
    2. Build toggle switches for different notification types
    3. Add email notification frequency settings (immediate/daily/weekly)
    4. Implement push notification permission request flow
    5. Create notification testing interface (send test emails)
    6. Add unsubscribe links to email templates
    7. Build notification history/log viewer for user
    8. Create notification preferences backup/restore feature
  - Outcome: Complete notification preferences UI ready for backend integration

### Week 11 — Dec 14–15 (Short Week): Final Prep
- [ ] Josh — Task 37: Final P0 checklist + launch notes + deployment checklist
  - Specs: tasks.md §37; design.md → SLOs, Pilot Scenarios
  - Outcome: Complete validation checklist + operational docs
- [ ] Ben — Task 29: Finalize pilot scenarios and handoff documentation
  - Specs: tasks.md §29; design.md → Pilot Scenarios
  - Subtasks:
    1. Complete all pilot test scenario documentation
    2. Create LGS onboarding playbook for store owners
    3. Build pilot store agreement templates
    4. Create user support documentation (FAQ, troubleshooting)
    5. Document the "go-live" checklist for each pilot store
    6. Create pilot store success metrics dashboard
    7. Build feedback collection system for pilot stores
    8. Create pilot store support contact list and escalation procedures
  - Outcome: Complete pilot program supports smooth LGS onboarding and success measurement

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

---

### Assignment Legend
- **Josh** = you (primary engineer)
- **Ben** = collaborator (complementary tasks)

If any scope shifts, mirror updates into `.kiro/specs/trade-equalizer-platform/tasks.md` and reference the sections above for quick discovery.