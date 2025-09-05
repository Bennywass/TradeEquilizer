# Requirements Document

## Scope Tags
- **P0 (MVP pilot)** — must ship for first LGS trials
- **P1 (Beta)** — add after pilot learnings (2–6 weeks)
- **P2 (Later/Conditional)** — only if demanded by paying users

## Glossary & Global Rules
- **P95 latency**: 95th percentile for the given operation
- **Fairness threshold**: default ±5%; compute value deltas after rounding to cents
- **Must/Want/Nice**: want-list priorities 3/2/1 (3 = Must)
- **Price Source (P0)**: TCGplayer Market, USD only
- **MTG-only (P0)**: Multi-TCG is out of scope for MVP
- **QR security**: single-use token, TTL ≤ 2 minutes, rate-limit 10/min/IP
- **Concurrency**: items in an active proposal are reserved up to 5 minutes
- **RLS**: Row-level security on Inventory, Want, Trade, EventMember; no PII in analytics

## Introduction

TradeEqualizer is a lightweight micro-SaaS platform designed to facilitate fair and efficient Magic: The Gathering (MTG) card trading between players. The platform uses a match-first engine that analyzes user inventories and want lists to suggest optimal trades based on real market prices. The system supports both individual trading sessions and event-based trading for local game stores (LGS), with features including QR code connectivity, automated trade balancing, and receipt generation.

## Requirements

### Requirement 1 — Inventory & Want List (Trade-first collection) [P0]

**User Story:** As a player, I manage tradeables and wants quickly.

#### Acceptance Criteria

1. WHEN storing inventory THEN the system SHALL capture qty, condition (NM/LP/MP/HP), foil, tradable
2. WHEN searching cards from local catalog THEN the system SHALL return results with P95 <150ms
3. WHEN importing CSV THEN the system SHALL process 100+ rows and map to inventory
4. WHEN storing want list THEN the system SHALL store qty, minCondition, foilOk, priority (1–3)
5. WHEN items are non-tradable THEN the system SHALL exclude from matching

### Requirement 2 — Match-First Suggestions & Fairness [P0]

**User Story:** As a player, I get fair, want-first suggestions fast.

#### Acceptance Criteria

1. WHEN generating suggestions THEN the system SHALL achieve P95 <3s and show skeleton UI if slower
2. WHEN prioritizing THEN the system SHALL prioritize coverage of higher-priority wants
3. WHEN enforcing fairness THEN the system SHALL enforce within ±5% (rounded to cents first). (Configurable per session in P1: ±2–10%.)
4. WHEN imbalanced THEN the system SHALL offer "make-it-even" fillers
5. WHEN displaying THEN the system SHALL show 3–5 candidate bundles with coverage badges
6. WHEN any Must is satisfied THEN the system SHALL highlight this in UI

### Requirement 3 — QR Connect (1:1 Session) [P0]

**User Story:** As a player, I start a trade via QR with no setup.

#### Acceptance Criteria

1. WHEN creating QR THEN the system SHALL create single-use, short-lived code (TTL ≤ 2 min)
2. WHEN scanning THEN the system SHALL establish a 1:1 session
3. WHEN expired THEN the system SHALL prevent expired codes from starting sessions
4. WHEN connected THEN the system SHALL enable real-time proposal sharing
5. WHEN creating sessions THEN the system SHALL rate-limit (10/min/IP)

### Requirement 4 — Receipts & Inventory Updates [P0]

**User Story:** When we agree, I get a clear receipt and my lists update.

#### Acceptance Criteria

1. WHEN accepting THEN the system SHALL generate PDF receipt P95 ≤2s
2. WHEN generating receipt THEN the system SHALL show items, qty, condition, prices, totals per side
3. WHEN completing THEN the system SHALL auto-update both inventories atomically
4. WHEN requested (P1) THEN the system SHALL optionally email the receipt
5. WHEN generating THEN the system SHALL verify accuracy of values/quantities

### Requirement 5 — Event Scope & Kiosk (Anonymous) [P0]

**User Story:** As an LGS, I host scoped trading during events.

#### Acceptance Criteria

1. WHEN creating event THEN the system SHALL generate unique room code
2. WHEN matching THEN the system SHALL scope to event participants only
3. WHEN showing nearby matches THEN the system SHALL show event-only candidates
4. WHEN ~50 users (P1) THEN the system SHALL achieve nearby matches P95 <1s
5. WHEN kiosk THEN the system SHALL show anonymous rotating match prompts

### Requirement 6 — Pricing Data & Staleness [P0]

**User Story:** Trades use accurate market values.

#### Acceptance Criteria

1. WHEN updating prices THEN the system SHALL pull from TCGplayer API within rate limits
2. WHEN storing THEN the system SHALL store market/low/high with timestamp
3. WHEN API unavailable THEN the system SHALL fallback to cached snapshots
4. WHEN daily worker (P1) THEN the system SHALL complete within API budget, P95 ≤10 min
5. WHEN displaying THEN the system SHALL show as-of timestamp; log snapshot version per trade/receipt

### Requirement 7 — Subscriptions & Entitlements [P0]

**User Story:** Monetize via Free/Pro/LGS with clean upsells.

#### Acceptance Criteria

1. WHEN processing payments THEN the system SHALL process via Stripe
2. WHEN checking entitlements THEN the system SHALL enforce by plan
3. WHEN Free overage THEN the system SHALL show upgrade modal (Pro $5/mo; LGS $15–19/mo)
4. WHEN payment fails THEN the system SHALL gracefully handle errors
5. WHEN expiry THEN the system SHALL downgrade to Free limits

### Requirement 8 — Security, Privacy, Legal [P0]

**User Story:** I can use the service with confidence.

#### Acceptance Criteria

1. WHEN logging THEN the system SHALL have no PII in logs; RLS on key tables; analytics are aggregate only
2. WHEN preventing abuse THEN the system SHALL rate limit APIs
3. WHEN authenticating THEN the system SHALL use secure email link (Supabase)
4. WHEN displaying legal THEN the system SHALL show ToS/Privacy displayed and linked
5. WHEN disclaiming THEN the system SHALL state "Compatible with trading card games; not affiliated with Wizards of the Coast."

### Requirement 9 — Accessibility & Performance [P0]

**User Story:** The app is usable and fast on any device.

#### Acceptance Criteria

1. WHEN loading THEN the system SHALL have proper labels, focus order, landmarks (WCAG basics)
2. WHEN measuring (P1) THEN the system SHALL achieve green Core Web Vitals on landing page
3. WHEN navigating THEN the system SHALL work keyboard navigation for all interactive elements
4. WHEN displaying THEN the system SHALL use mobile-first responsive layout
5. WHEN showing tables THEN the system SHALL have headers and sorting (where applicable)

### Requirement 10 — Game & Price Source Selection [P1]

**User Story:** Choose game and price source per session.

#### Acceptance Criteria

1. WHEN selecting game THEN the system SHALL select at session start (MTG at P0; add others in P1/P2)
2. WHEN offering sources THEN the system SHALL offer price sources (Market vs LGS Buylist in LGS mode)
3. WHEN calculating THEN the system SHALL use chosen source consistently
4. WHEN displaying THEN the system SHALL show currency, source, as-of
5. WHEN overriding THEN the system SHALL allow manual line overrides with tooltip

### Requirement 11 — Variants: Printing, Language, Condition [P0]

**User Story:** Specific variants matter and affect value.

#### Acceptance Criteria

1. WHEN storing inventory THEN the system SHALL support set/collector #, language, foil/etched
2. WHEN applying multipliers (P1) THEN the system SHALL apply condition multipliers (defaults: NM 1.0, LP 0.9, MP 0.75, HP 0.5) with LGS override
3. WHEN matching THEN the system SHALL respect minCondition and foilOk
4. WHEN showing coverage THEN the system SHALL reflect these constraints in badges
5. WHEN normalizing THEN the system SHALL normalize distinct printings and languages correctly

### Requirement 12 — PWA & Offline Basics [P0 → P1]

**User Story:** Works at shops with weak signal.

#### Acceptance Criteria

1. WHEN installing [P0] THEN the system SHALL be installable PWA on mobile
2. WHEN caching [P0] THEN the system SHALL cache last price snapshot for calculations
3. WHEN offline [P1] THEN the system SHALL support offline QR/session & queued receipts
4. WHEN stale (P1) THEN the system SHALL show stale-data banner if snapshot >24h old
5. WHEN managing (P1) THEN the system SHALL provide Clear offline data + storage quota status

### Requirement 13 — Event Privacy & Consent [P0]

**User Story:** I control my visibility.

#### Acceptance Criteria

1. WHEN joining THEN the system SHALL default private
2. WHEN opting in (P1) THEN the system SHALL require explicit opt-in to event visibility, auto-expire +2h after event end
3. WHEN kiosk THEN the system SHALL be anonymous only—no PII
4. WHEN sharing (P1) THEN the system SHALL require explicit consent for contact info
5. WHEN ending THEN the system SHALL auto-revert to private at event end

### Requirement 14 — Monitoring & Abuse Prevention [P0 → P1]

**User Story:** The service stays healthy during pilots.

#### Acceptance Criteria

1. WHEN creating QR/session [P0] THEN the system SHALL rate-limit; alert on spikes
2. WHEN accepting trades [P0] THEN the system SHALL audit trail on trade accept/receipt
3. WHEN measuring SLOs (P1) THEN the system SHALL achieve Suggestion P95 <3s; Event matches P95 <1s (99% goal)
4. WHEN checking health (P1) THEN the system SHALL provide JSON health endpoint (DB, price worker, queue)
5. WHEN tracking (P1) THEN the system SHALL track error budgets for ops

### Requirement 15 — Data Portability & Deletion [P1]

**User Story:** I can export or delete my data.

#### Acceptance Criteria

1. WHEN exporting THEN the system SHALL export CSV/JSON (inventory, wants, receipts)
2. WHEN deleting THEN the system SHALL delete account purges PII; confirm within 7 days
3. WHEN retaining THEN the system SHALL retain receipts for configurable days (for compliance)
4. WHEN exporting THEN the system SHALL include all user-generated content
5. WHEN confirming THEN the system SHALL confirm deletion completion within SLA

### Requirement 16 — Plan Limits & Upgrades [P0]

**User Story:** I understand limits and how to upgrade.

#### Acceptance Criteria

1. WHEN Free THEN the system SHALL limit up to 100 inventory, 50 wants, 10 suggestions/day, 1 event/month
2. WHEN Pro THEN the system SHALL provide unlimited + notifications + CSV import/export. (Notifications in Req 20.)
3. WHEN LGS THEN the system SHALL provide kiosk, event codes, co-branding
4. WHEN approaching THEN the system SHALL show friendly limit banners + upgrade modals
5. WHEN exceeding THEN the system SHALL block new actions (existing data unaffected)

### Requirement 17 — Immutable Trade Snapshot & Reservations [P0]

**User Story:** Trades are reproducible and conflict-safe.

#### Acceptance Criteria

1. WHEN accepting THEN the system SHALL store immutable snapshot: item variants, price source, snapshot version, fairness threshold, manual overrides
2. WHEN proposing THEN the system SHALL reserve items in active proposals up to 5 minutes
3. WHEN conflicting THEN the system SHALL fail gracefully with "Recalculate" banner
4. WHEN expiring THEN the system SHALL release reservations and notify sessions
5. WHEN viewing THEN the system SHALL show exact snapshot for completed trades

### Requirement 18 — Currency & Region [P2]

**User Story:** Show values in the right currency.

#### Acceptance Criteria

1. WHEN launching THEN the system SHALL use USD everywhere at launch (P0)
2. WHEN adding EUR (P2) THEN the system SHALL add via FX or EU source; label method & rate/timestamp
3. WHEN configuring (P2) THEN the system SHALL allow LGS to set preferred currency/source per event
4. WHEN receipting THEN the system SHALL state currency and conversion method
5. WHEN converting THEN the system SHALL show FX rate & timestamp on converted values

### Requirement 19 — LGS Buylist Mode [P2]

**User Story:** Use the store's buylist for trades.

#### Acceptance Criteria

1. WHEN uploading THEN the system SHALL upload CSV (SKU, set, condition multipliers, price)
2. WHEN computing THEN the system SHALL compute in Buylist mode; fallback to Market for missing SKUs with badge
3. WHEN showing THEN the system SHALL show Buylist vs Market badges
4. WHEN receipting THEN the system SHALL state which mode was used
5. WHEN missing THEN the system SHALL gracefully fallback & indicators when buylist entries missing

### Requirement 20 — Notifications (Pro) & Event Mail [P1]

**User Story:** Pro users get match alerts; LGS can send reminders.

#### Acceptance Criteria

1. WHEN Pro THEN the system SHALL opt-in to match alerts for Must wants (email/push)
2. WHEN LGS THEN the system SHALL send event reminders to opted-in participants (unsubscribe required)
3. WHEN joining THEN the system SHALL provide clear consent options
4. WHEN sending THEN the system SHALL honor preferences; provide easy unsubscribe
5. WHEN limiting THEN the system SHALL rate-limit and queue notifications

### Requirement 21 — Ops: Flags, Backups, Recovery [P1]

**User Story:** Safe rollout and reliable recovery.

#### Acceptance Criteria

1. WHEN deploying THEN the system SHALL use feature flags gate kiosk, notifications, multi-TCG
2. WHEN backing up THEN the system SHALL perform nightly encrypted backups, documented restore drill; retention policy (e.g., 30 days)
3. WHEN checking health THEN the system SHALL provide health JSON shows DB, price worker, queues
4. WHEN retaining THEN the system SHALL implement clear data retention policies in docs
5. WHEN monitoring THEN the system SHALL provide monitoring/alerting on critical components