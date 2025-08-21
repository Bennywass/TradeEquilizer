# Requirements Document

## Introduction

TradeEqualizer is a lightweight micro-SaaS platform designed to facilitate fair and efficient Magic: The Gathering (MTG) card trading between players. The platform uses a match-first engine that analyzes user inventories and want lists to suggest optimal trades based on real market prices. The system supports both individual trading sessions and event-based trading for local game stores (LGS), with features including QR code connectivity, automated trade balancing, and receipt generation.

## Requirements

### Requirement 1

**User Story:** As an MTG player, I want to manage my card inventory and want list digitally, so that I can efficiently track what I have available for trade and what I'm looking for.

#### Acceptance Criteria

1. WHEN a user adds a card to their inventory THEN the system SHALL store the card details including quantity, condition (NM/LP/MP/HP), foil status, and tradable flag
2. WHEN a user searches for cards THEN the system SHALL return results from the local card catalog in under 150ms
3. WHEN a user imports a CSV file THEN the system SHALL process 100+ rows and map them to inventory items
4. WHEN a user adds items to their want list THEN the system SHALL store quantity, minimum condition, foil preference, and priority level (1-3)
5. IF a user marks an inventory item as non-tradable THEN the system SHALL exclude it from trade matching algorithms

### Requirement 2

**User Story:** As an MTG player, I want the system to suggest fair trades based on current market prices, so that I can make equitable exchanges with other players.

#### Acceptance Criteria

1. WHEN two users initiate a trade session THEN the system SHALL analyze both inventories and want lists to generate trade suggestions with P95 latency under 3 seconds and show skeleton UI if slower
2. WHEN generating trade suggestions THEN the system SHALL prioritize coverage of high-priority want list items
3. WHEN calculating trade fairness THEN the system SHALL ensure value difference is within configurable thresholds (±5% default, ±2-10% for LGS sessions) with values rounded to cents before percentage comparison
4. IF a trade is imbalanced THEN the system SHALL suggest "make-it-even" filler cards to balance the trade
5. WHEN displaying trade suggestions THEN the system SHALL show 3-5 candidate trades with coverage badges
6. WHEN a trade suggestion satisfies at least one "Must" priority item THEN the system SHALL highlight this in the interface

### Requirement 3

**User Story:** As an MTG player, I want to connect with other traders via QR codes, so that I can quickly initiate trading sessions without complex setup.

#### Acceptance Criteria

1. WHEN a user generates a QR code THEN the system SHALL create a short-lived connection code
2. WHEN another user scans the QR code THEN the system SHALL establish a 1:1 trade session between the users
3. WHEN a QR code expires THEN the system SHALL prevent new connections using that code
4. WHEN users are connected via QR THEN the system SHALL enable real-time trade proposal sharing

### Requirement 4

**User Story:** As an MTG player, I want to receive a receipt for completed trades, so that I have a record of the exchange for my collection management.

#### Acceptance Criteria

1. WHEN a trade is accepted THEN the system SHALL generate a PDF receipt with P95 latency under 2 seconds to account for cold starts
2. WHEN generating a receipt THEN the system SHALL include all traded items, quantities, conditions, and calculated values for both parties
3. WHEN a trade is completed THEN the system SHALL automatically update both users' inventories to reflect the exchange
4. IF requested THEN the system SHALL email the receipt to both parties
5. WHEN a receipt is generated THEN the system SHALL ensure all values and quantities are accurate

### Requirement 5

**User Story:** As a local game store owner, I want to host trading events where players can find matches within the event scope, so that I can facilitate organized trading sessions.

#### Acceptance Criteria

1. WHEN an LGS creates an event THEN the system SHALL generate a unique room code for the event
2. WHEN players join an event THEN the system SHALL scope their trade matching to other event participants
3. WHEN displaying nearby matches THEN the system SHALL show only matches within the current event scope
4. WHEN 50 users are in an event THEN the system SHALL return nearby matches in under 1 second
5. IF a kiosk mode is enabled THEN the system SHALL display anonymous match prompts on a rotating basis

### Requirement 6

**User Story:** As a platform user, I want access to current card pricing data, so that trades are based on accurate market values.

#### Acceptance Criteria

1. WHEN the system updates prices THEN it SHALL pull data from TCGplayer API within rate limits
2. WHEN storing price data THEN the system SHALL capture market, low, high values and timestamp
3. WHEN price API is unavailable THEN the system SHALL fall back to cached price snapshots
4. WHEN daily price updates run THEN the system SHALL complete within the allocated API budget with P95 duration under 10 minutes
5. IF price data is stale THEN the system SHALL indicate the age of pricing information to users and log price snapshot version used on each trade and receipt

### Requirement 7

**User Story:** As a platform operator, I want to offer tiered subscription plans, so that I can monetize the platform while providing value to different user types.

#### Acceptance Criteria

1. WHEN a user selects a subscription plan THEN the system SHALL process payment via Stripe
2. WHEN subscription entitlements are checked THEN the system SHALL enforce feature access based on plan level
3. WHEN a free user exceeds limits THEN the system SHALL prompt for upgrade to Pro ($5/mo) or LGS ($15-19/mo) plans
4. WHEN payment processing fails THEN the system SHALL gracefully handle errors and notify the user
5. IF a subscription expires THEN the system SHALL downgrade access to free tier features

### Requirement 8

**User Story:** As a platform user, I want my personal information to be secure and private, so that I can use the service with confidence.

#### Acceptance Criteria

1. WHEN user data is logged THEN the system SHALL NOT include personally identifiable information (PII) and SHALL implement row-level security on Inventory, Want, Trade, and EventMember tables with no PII in analytics
2. WHEN API requests are made THEN the system SHALL enforce rate limits to prevent abuse
3. WHEN users authenticate THEN the system SHALL use secure email link authentication via Supabase
4. WHEN displaying legal information THEN the system SHALL show Terms of Service and Privacy Policy
5. WHEN showing disclaimers THEN the system SHALL clearly state "compatible with TCGs; not affiliated with Wizards of the Coast"

### Requirement 9

**User Story:** As a platform user, I want the interface to be accessible and performant, so that I can use the service effectively regardless of my abilities or device.

#### Acceptance Criteria

1. WHEN the interface loads THEN it SHALL meet accessibility standards with proper labels and focus order
2. WHEN measuring Core Web Vitals THEN the landing page SHALL achieve green scores
3. WHEN users navigate the interface THEN keyboard navigation SHALL work for all interactive elements
4. WHEN the application loads THEN it SHALL be responsive across desktop and mobile devices
5. WHEN displaying data tables THEN they SHALL include proper headers and sorting capabilities

### Requirement 10

**User Story:** As a user, I want to select different TCG games and price sources per session, so that I can trade cards from multiple games using appropriate pricing.

#### Acceptance Criteria

1. WHEN creating a trade session THEN the system SHALL allow selection of game type (MTG, Pokémon, etc.)
2. WHEN selecting price sources THEN the system SHALL offer options like TCGplayer market vs store buylist in LGS mode
3. WHEN computing trade values THEN the system SHALL use the chosen price source for all calculations
4. WHEN displaying prices THEN the system SHALL show currency, price source, and as-of timestamp
5. WHEN users need price adjustments THEN the system SHALL allow manual override at line-item level with explanatory tooltip

### Requirement 11

**User Story:** As a trader, I want to specify exact printings, languages, and conditions, so that trades reflect the true value and desirability of specific card variants.

#### Acceptance Criteria

1. WHEN adding cards to inventory THEN the system SHALL support specific printings (set/collector number), language, foil/etched variants
2. WHEN calculating values THEN the system SHALL apply condition multipliers based on card condition using documented defaults (NM=1.0, LP=0.9, MP=0.75, HP=0.5) with LGS override capability
3. WHEN matching trades THEN the system SHALL respect minimum condition and foil preferences from want lists
4. WHEN displaying coverage badges THEN the system SHALL indicate satisfaction of minCondition and foilOk constraints
5. WHEN normalizing card data THEN the system SHALL handle different printings and language variants correctly

### Requirement 12

**User Story:** As a player at events with poor signal, I want to continue trading offline, so that connectivity issues don't prevent me from participating.

#### Acceptance Criteria

1. WHEN the app is accessed THEN it SHALL be installable as a PWA on mobile devices
2. WHEN offline THEN the system SHALL cache the last price snapshot for trade calculations
3. WHEN generating QR codes and sessions THEN the system SHALL work offline-first with local storage
4. WHEN receipts are generated offline THEN the system SHALL queue them to send when connectivity returns
5. IF price data is older than 24 hours THEN the system SHALL display a stale-data banner to users and provide "Clear offline data" control with storage quota status in PWA

### Requirement 13

**User Story:** As a player at events, I want to control my visibility and privacy, so that I can participate safely without unwanted contact.

#### Acceptance Criteria

1. WHEN joining events THEN the system SHALL default to private visibility mode
2. WHEN opting into event visibility THEN the system SHALL require explicit opt-in and time-box the visibility with auto-expiry 2 hours after event end
3. WHEN displaying kiosk information THEN the system SHALL show only anonymous prompts without personal details
4. WHEN sharing contact information THEN the system SHALL require explicit consent before sharing emails
5. WHEN event ends THEN the system SHALL automatically revert to private visibility

### Requirement 14

**User Story:** As a platform operator, I want comprehensive monitoring and abuse prevention, so that I can run pilots safely and maintain service quality.

#### Acceptance Criteria

1. WHEN users create QR codes or sessions THEN the system SHALL enforce rate limits to prevent abuse
2. WHEN trades are accepted THEN the system SHALL log audit trails for receipts and trade completion
3. WHEN measuring performance THEN the system SHALL maintain 99% suggestion latency under 3 seconds and event matches under 1 second
4. WHEN system health is checked THEN the system SHALL provide a health page with key metrics
5. WHEN errors occur THEN the system SHALL track error budgets and SLOs for operational monitoring

### Requirement 15

**User Story:** As a user, I want to export and delete my data, so that I maintain control over my personal information and can migrate if needed.

#### Acceptance Criteria

1. WHEN requesting data export THEN the system SHALL provide CSV/JSON export of inventory, wants, and receipts
2. WHEN deleting account THEN the system SHALL purge all personally identifiable information
3. WHEN retaining receipts THEN the system SHALL keep them for a configurable number of days for legal compliance
4. WHEN exporting data THEN the system SHALL include all user-generated content in standard formats
5. WHEN data is deleted THEN the system SHALL confirm complete removal within specified timeframes

### Requirement 16

**User Story:** As a Free/Pro/LGS user, I want clear limits and smooth upgrade paths, so that I understand what I can do and how to get more features.

#### Acceptance Criteria

1. WHEN using Free tier THEN the system SHALL limit to 100 inventory items, 50 wants, 10 suggestions/day, 1 event/month
2. WHEN using Pro tier THEN the system SHALL provide unlimited inventory/wants, notifications, and CSV import
3. WHEN using LGS tier THEN the system SHALL enable kiosk mode, event codes, and co-branding options
4. WHEN approaching limits THEN the system SHALL display graceful limit banners and upgrade modals
5. WHEN limits are exceeded THEN the system SHALL prevent further actions while maintaining existing functionality

### Requirement 17

**User Story:** As a user, I want finalized trades to be reproducible and safe from double-spend, so that I can trust the trading system's integrity.

#### Acceptance Criteria

1. WHEN a trade is accepted THEN the system SHALL store an immutable snapshot including items with printing/language details, price source, snapshot version, fairness threshold, and manual overrides
2. WHEN items are included in an active proposal THEN the system SHALL reserve them for up to 5 minutes to prevent conflicts
3. WHEN conflicting proposals are attempted THEN the system SHALL fail gracefully with a "recalculate" banner and clear explanation
4. WHEN reservations expire THEN the system SHALL automatically release items and notify affected sessions
5. WHEN viewing completed trades THEN the system SHALL display the exact snapshot data used for that trade

### Requirement 18

**User Story:** As a user or LGS, I want values shown in the correct currency for my region, so that I can understand pricing in familiar terms.

#### Acceptance Criteria

1. WHEN displaying prices THEN the system SHALL support USD at launch and show currency symbols everywhere prices appear
2. IF EUR support is enabled THEN the system SHALL convert using daily FX rates or native EU sources with clear labeling
3. WHEN configuring events THEN LGS SHALL be able to set preferred currency and price source
4. WHEN generating receipts THEN the system SHALL clearly state the currency and conversion method used
5. WHEN prices are converted THEN the system SHALL show the conversion rate and timestamp

### Requirement 19

**User Story:** As an LGS, I want trades to optionally reference my buylist prices, so that trades reflect my actual purchasing rates.

#### Acceptance Criteria

1. WHEN managing LGS settings THEN the system SHALL allow CSV buylist upload with SKU, set, condition multipliers, and prices
2. WHEN session uses "Buylist" mode THEN the system SHALL compute values from the uploaded list with market fallback for missing SKUs
3. WHEN displaying buylist prices THEN the system SHALL show badges indicating buylist vs market pricing
4. WHEN generating receipts THEN the system SHALL clearly state whether Market or Buylist pricing was used
5. WHEN buylist data is missing THEN the system SHALL gracefully fallback to market prices with clear indicators

### Requirement 20

**User Story:** As a Pro user, I want match alerts for high-priority wants; as an LGS, I want to send event reminders to participants.

#### Acceptance Criteria

1. WHEN Pro users enable notifications THEN the system SHALL send email/push alerts for new matches on Must-have wants with opt-in controls
2. WHEN LGS creates events THEN the system SHALL allow sending reminder emails to opted-in participants with required unsubscribe links
3. WHEN users join events THEN the system SHALL provide clear opt-in choices for notifications and contact preferences
4. WHEN sending notifications THEN the system SHALL respect user preferences and provide easy unsubscribe options
5. WHEN notification limits are reached THEN the system SHALL queue notifications and respect rate limits

### Requirement 21

**User Story:** As a platform operator, I need safe feature rollout and reliable recovery capabilities, so that I can maintain service quality and handle incidents.

#### Acceptance Criteria

1. WHEN deploying features THEN the system SHALL use feature flags to gate kiosk mode, notifications, and multi-TCG functionality
2. WHEN backing up data THEN the system SHALL perform nightly encrypted backups with documented restore procedures
3. WHEN checking system health THEN the system SHALL provide a health page showing DB, price worker, and queue status in JSON format
4. WHEN managing data retention THEN the system SHALL implement clear retention policies (e.g., 30 days for backups)
5. WHEN incidents occur THEN the system SHALL provide monitoring and alerting for all critical system components