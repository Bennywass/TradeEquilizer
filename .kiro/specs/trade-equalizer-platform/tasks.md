# Implementation Plan

- [ ] 1. Initialize Next.js PWA project with core dependencies
  - Set up Next.js 14+ with App Router and TypeScript configuration
  - Install and configure PWA dependencies (next-pwa, workbox)
  - Create basic project structure with mobile-first responsive layout
  - Set up ESLint, Prettier, and basic CI/CD pipeline
  - _Requirements: 9.4, 9.5_

- [ ] 2. Configure Supabase integration and authentication
  - Initialize Supabase project and configure environment variables
  - Set up Supabase client with TypeScript types generation
  - Implement email-based authentication with Supabase Auth
  - Create protected route middleware and auth context providers
  - _Requirements: 8.3_

- [ ] 3. Create database schema and migrations
  - Write SQL migrations for all core tables (users, items, inventory, wants, prices, trade_sessions, events)
  - Set up database indexes for performance optimization
  - Configure row-level security policies for data protection
  - Create database seed scripts with sample MTG card data
  - _Requirements: 1.1, 1.4, 6.1, 8.1_

- [ ] 4. Implement multi-TCG card catalog system with search functionality
  - Create Item model supporting multiple games (MTG, Pokémon, etc.) with language and finish variants
  - Build full-text search API endpoint with PostgreSQL search vectors and game filtering
  - Implement Scryfall API integration for bulk MTG card data import
  - Add support for other TCG APIs (Pokémon TCG API, etc.)
  - Create background job for daily card catalog synchronization across all games
  - Write unit tests for search functionality and multi-game data import
  - _Requirements: 1.2, 6.1, 10.1_

- [ ] 5. Build inventory management system with printing specifics
  - Create Inventory model with language, finish, and condition tracking
  - Implement inventory API endpoints with printing-specific validation
  - Build mobile-first inventory management UI with printing selection controls
  - Add CSV import functionality supporting printing details and language variants
  - Create inventory filtering by condition, language, finish, and tradable status
  - Implement subscription tier limits for inventory count (Free: 100 items)
  - Write integration tests for inventory operations and limit enforcement
  - _Requirements: 1.1, 1.5, 11.1, 16.1_

- [ ] 6. Implement want list management system with printing constraints
  - Create Want model with language preferences, finish options, and condition constraints
  - Build want list API endpoints with printing-specific validation
  - Design mobile-optimized want list interface with priority and constraint indicators
  - Implement want list CRUD operations with real-time updates and constraint checking
  - Add bulk want list management with printing specification features
  - Implement subscription tier limits for want list count (Free: 50 wants)
  - Write unit tests for want list business logic and constraint matching
  - _Requirements: 1.4, 11.2, 11.4, 16.1_

- [ ] 7. Integrate multi-source pricing system with condition multipliers
  - Set up multiple price source APIs (TCGplayer market/low, store buylist)
  - Create Price model with source tracking, condition multipliers, and finish multipliers
  - Implement daily price synchronization with version tracking for audit trails
  - Build price caching layer with Redis and source-specific caching strategies
  - Add price staleness indicators, source selection UI, and manual override capabilities
  - Create price source selection per trade session with tooltip explanations
  - Write tests for multi-source pricing integration and version tracking
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 10.2, 10.3, 10.4, 10.5, 11.2_

- [ ] 8. Develop core matching algorithm with printing awareness
  - Implement coverage-first matching algorithm respecting language and finish constraints
  - Create configurable trade fairness validation (±5% default, ±2-10% for LGS)
  - Build make-it-even suggestion system preferring small cards and printing swaps
  - Add coverage scoring with Must/Want/Nice counters and visual badges
  - Implement P95 <3s performance target with skeleton UI for slower responses
  - Add conflict detection for items becoming non-tradable during sessions
  - Write comprehensive unit tests for matching logic and constraint handling
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 11.3, 11.4_

- [ ] 9. Build QR code trading session system with game and price source selection
  - Create TradeSession model with game type, price source, and configurable fairness thresholds
  - Implement QR code generation with rate limiting and validation system
  - Build session joining functionality via QR code scanning with expiry handling
  - Add real-time WebSocket connections for trade sessions with offline-first capability
  - Create session state management, cleanup processes, and conflict resolution
  - Implement subscription tier limits for session creation (Free: rate limited)
  - Write integration tests for QR code trading flow and offline functionality
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 10.1, 10.2, 12.3, 14.1, 16.1_

- [ ] 10. Implement real-time trade proposal system
  - Create TradeProposal model with status tracking
  - Build WebSocket handlers for real-time trade communication
  - Implement trade proposal creation and validation
  - Add proposal acceptance/rejection functionality
  - Create conflict resolution for concurrent trade actions
  - Write end-to-end tests for real-time trading flow
  - _Requirements: 2.1, 2.5_

- [ ] 11. Develop mobile-first trading interface
  - Design touch-optimized trade proposal UI with swipe gestures
  - Implement camera integration for QR code scanning
  - Build responsive trade session interface with real-time updates
  - Add haptic feedback for trade confirmations
  - Create gesture navigation between trade screens
  - Write mobile-specific UI tests and accessibility checks
  - _Requirements: 3.1, 9.3, 9.4_

- [ ] 12. Create PDF receipt generation system with audit trail
  - Implement PDF generation using PDFKit with complete trade details and price versions
  - Design receipt template showing printing details, price sources, and manual overrides
  - Add email delivery functionality with consent verification for receipts
  - Create receipt storage, retrieval system, and offline queuing for poor connectivity
  - Optimize PDF generation performance (P95 <2s including cold starts)
  - Implement immutable trade record storage for audit compliance
  - Write tests for receipt accuracy, generation speed, and offline queuing
  - _Requirements: 4.1, 4.2, 4.4, 4.5, 6.5, 12.4, 13.4_

- [ ] 13. Build inventory update system for completed trades
  - Implement atomic inventory updates for trade completion
  - Create trade history tracking and audit trail
  - Add rollback functionality for failed trade updates
  - Build inventory reconciliation and validation
  - Create trade completion notifications and confirmations
  - Write integration tests for inventory update accuracy
  - _Requirements: 4.3_

- [ ] 14. Implement event system with privacy controls and game-specific settings
  - Create Event and EventMember models with game type, price source defaults, and privacy settings
  - Build event creation with configurable fairness thresholds and time-boxed visibility
  - Implement event-scoped trade matching with P95 <1s performance for 50+ users
  - Add event joining via unique codes with explicit consent for visibility and contact sharing
  - Create event member visibility controls with automatic expiry and privacy defaults
  - Implement subscription tier limits for event creation (Free: 1 event/month)
  - Write tests for event isolation, privacy controls, and performance under load
  - _Requirements: 5.1, 5.2, 5.4, 5.5, 10.1, 10.2, 13.1, 13.2, 13.4, 13.5, 14.3, 16.1_

- [ ] 15. Develop privacy-focused kiosk mode for LGS displays
  - Create kiosk-optimized UI showing only anonymous aggregated match data
  - Implement anonymous match board with rotating prompts and no personal information
  - Build event-scoped nearby matches display respecting privacy settings
  - Add auto-refresh functionality and co-branding options for LGS subscribers
  - Create kiosk configuration interface with privacy compliance controls
  - Ensure kiosk pulls only anonymous aggregates without exposing user details
  - Write tests for kiosk privacy compliance and performance with 50+ users
  - _Requirements: 5.3, 5.5, 13.3, 16.3_

- [ ] 16. Integrate Stripe payment system
  - Set up Stripe integration with subscription plans (Free/Pro/LGS)
  - Implement checkout flow for subscription upgrades
  - Build webhook handlers for payment events
  - Create subscription entitlement enforcement system
  - Add billing portal integration for subscription management
  - Write tests for payment processing and webhook handling
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 17. Implement PWA features and offline functionality
  - Configure service worker with caching strategies
  - Add PWA manifest with mobile-optimized settings
  - Implement offline data synchronization for inventory/wants
  - Build background sync for trade proposals
  - Add push notification system for trade updates
  - Create offline indicator and sync status UI
  - Write tests for offline functionality and data sync
  - _Requirements: 9.1, 9.4_

- [ ] 18. Add security and rate limiting systems
  - Implement API rate limiting with Redis-based counters
  - Add input validation and sanitization middleware
  - Create PII protection in logging systems
  - Build security headers and CORS configuration
  - Add request monitoring and abuse detection
  - Write security tests and penetration testing scenarios
  - _Requirements: 8.1, 8.2, 8.4_

- [ ] 19. Create analytics and monitoring system
  - Integrate Plausible Analytics with privacy-focused tracking
  - Implement custom event tracking for key user actions
  - Build performance monitoring and error reporting
  - Add health check endpoints for system monitoring
  - Create user behavior analytics dashboard
  - Write tests for analytics data accuracy and privacy compliance
  - _Requirements: 8.5_

- [ ] 20. Build legal compliance and user safety features
  - Create Terms of Service and Privacy Policy pages
  - Add disclaimer about TCG compatibility and non-affiliation
  - Implement user data export and deletion functionality
  - Build content moderation and reporting systems
  - Add age verification and parental consent flows
  - Write compliance tests and legal requirement validation
  - _Requirements: 8.4, 8.5_

- [ ] 21. Optimize performance for mobile networks
  - Implement code splitting and lazy loading for mobile performance
  - Add image optimization and responsive image delivery
  - Create performance budgets and monitoring
  - Optimize database queries and add query performance monitoring
  - Build CDN integration for static asset delivery
  - Write performance tests for 3G network conditions
  - _Requirements: 9.1, 9.2_

- [ ] 22. Create comprehensive testing suite
  - Build end-to-end test suite covering complete trade flows
  - Add mobile-specific testing with device emulation
  - Create load testing for match algorithm performance
  - Implement accessibility testing with automated tools
  - Build cross-browser compatibility test suite
  - Add visual regression testing for UI consistency
  - _Requirements: 9.3, 9.5_

- [ ] 23. Implement deployment and DevOps pipeline
  - Set up production deployment pipeline with Vercel/Netlify
  - Configure environment-specific configurations and secrets
  - Add database migration and rollback procedures
  - Create monitoring and alerting for production issues
  - Build backup and disaster recovery procedures
  - Write deployment verification and smoke tests
  - _Requirements: 8.1, 8.2_

- [ ] 24. Create user onboarding and help system
  - Build interactive onboarding flow for new users
  - Create in-app help system and tooltips
  - Add tutorial mode for first-time trading
  - Implement contextual help and feature discovery
  - Build user feedback and support request system
  - Write tests for onboarding completion rates
  - _Requirements: 7.2_

- [ ] 25. Implement comprehensive audit logging and monitoring system
  - Create audit log system tracking all trade actions, user activities, and system events
  - Build admin dashboard for monitoring key metrics and SLO compliance
  - Implement health check endpoints with detailed system status information
  - Add error budget tracking and alerting for SLO violations
  - Create user usage tracking for subscription tier limit enforcement
  - Build abuse detection and rate limiting monitoring
  - Write tests for audit log accuracy and monitoring system reliability
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ] 26. Build data export and account deletion system
  - Implement comprehensive data export functionality (CSV/JSON for inventory, wants, receipts)
  - Create account deletion system with PII purging and configurable receipt retention
  - Build data portability features with standard format exports
  - Add user-initiated data export with email delivery
  - Implement GDPR-compliant data deletion with audit trails
  - Create data lifecycle management with automated cleanup processes
  - Write tests for data export completeness and deletion verification
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ] 27. Implement subscription tier system with graceful limit enforcement
  - Build subscription tier management with clear feature differentiation
  - Implement graceful limit banners and upgrade modals for Free tier users
  - Add Pro tier features (unlimited inventory/wants, notifications, CSV import)
  - Create LGS tier features (kiosk mode, event codes, co-branding)
  - Build usage tracking and limit enforcement with reset periods
  - Add subscription upgrade flows and entitlement checking
  - Write tests for limit enforcement, upgrade flows, and feature access
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [ ] 28. Enhance offline functionality and data synchronization
  - Implement comprehensive offline data caching for inventory and want lists
  - Build background sync for trade proposals and receipt delivery
  - Add stale data indicators and offline mode notifications
  - Create conflict resolution for offline-to-online data synchronization
  - Implement PWA installation prompts and offline-first architecture
  - Add push notification system for trade updates and event announcements
  - Write tests for offline functionality, sync accuracy, and conflict resolution
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ] 29. Build pilot-ready test scenarios and quality assurance
  - Create test scenarios for multi-price source validation (market vs buylist)
  - Build automated tests for printing/language/condition constraint handling
  - Implement offline event testing with cached prices and queued receipts
  - Add QR expiry testing and session regeneration validation
  - Create free-tier limit testing with banner triggers and recovery
  - Build load testing for event scenarios with 50+ concurrent users
  - Write comprehensive regression test suite for all pilot scenarios
  - _Requirements: All pilot test scenarios_

- [ ] 30. Implement immutable trade snapshots and concurrency control
  - Create item reservation system to prevent double-spend during active proposals
  - Build immutable trade snapshot storage with complete printing details, price versions, and manual overrides
  - Implement 5-minute reservation timeouts with automatic cleanup and conflict detection
  - Add graceful conflict resolution UI with "recalculate" banners and clear explanations
  - Create reservation monitoring and cleanup background jobs
  - Write comprehensive tests for concurrency scenarios and reservation edge cases
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

- [ ] 31. Build LGS buylist integration system
  - Create LGS buylist upload functionality with CSV parsing and validation
  - Implement buylist price computation with market fallback for missing SKUs
  - Build buylist management interface with SKU mapping and price override capabilities
  - Add buylist vs market pricing badges and clear indicators throughout the UI
  - Create receipt generation showing buylist vs market pricing sources used
  - Write tests for buylist integration, fallback scenarios, and price accuracy
  - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_

- [ ] 32. Implement currency support and regional pricing
  - Add multi-currency support starting with USD and EUR with clear labeling
  - Build daily FX rate integration and conversion display with timestamps
  - Create currency selection per event and session with conversion indicators
  - Implement native regional price source integration where available
  - Add currency conversion display in receipts with rates and methods used
  - Write tests for currency conversion accuracy and regional price source handling
  - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_

- [ ] 33. Build Pro notifications and LGS event reminder system
  - Implement push notification system for Pro users with Must-want match alerts
  - Create email notification preferences with granular opt-in controls
  - Build LGS event reminder system with participant opt-in and unsubscribe links
  - Add notification rate limiting and queue management for high-volume events
  - Create notification preference management UI with clear privacy controls
  - Write tests for notification delivery, opt-in flows, and unsubscribe functionality
  - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_

- [ ] 34. Implement feature flags and operational safety systems
  - Create feature flag system for kiosk mode, notifications, and multi-TCG functionality
  - Build nightly encrypted backup system with documented restore procedures
  - Implement comprehensive health check endpoints with DB, worker, and queue status
  - Add data retention policy enforcement with configurable backup retention periods
  - Create incident monitoring and alerting for all critical system components
  - Write tests for feature flag functionality, backup integrity, and health monitoring
  - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5_

- [ ] 35. Enhance security with QR token management and RLS hardening
  - Implement single-use QR tokens with 2-minute TTL and device scoping
  - Add QR token rotation on reuse attempts and rate limiting (10/min/IP)
  - Harden row-level security policies on all sensitive tables
  - Create comprehensive PII protection in logging and analytics systems
  - Add "Clear offline data" controls and PWA storage quota monitoring
  - Write security tests for token management, RLS policies, and PII protection
  - _Requirements: 8.1, 12.5, 14.1_

- [ ] 36. Build comprehensive pilot test scenarios
  - Create automated tests for concurrent session conflicts with chase cards
  - Build manual override persistence testing in trade snapshots and receipts
  - Implement kiosk PII protection testing with event scope validation
  - Add offline event testing with stale price banners and receipt queuing
  - Create buylist vs market mode testing for fairness and coverage differences
  - Build load testing scenarios for 50+ concurrent users in events
  - Write regression test suite covering all pilot scenarios and edge cases
  - _Requirements: All pilot test scenarios_

- [ ] 37. Final integration testing and launch preparation
  - Conduct comprehensive end-to-end testing across all features, games, and currencies
  - Perform security audit, penetration testing, and privacy compliance review
  - Execute performance testing under realistic load with SLO validation and concurrency stress testing
  - Validate all business requirements, acceptance criteria, pilot scenarios, and operational procedures
  - Create production deployment checklist with rollback procedures and feature flag controls
  - Prepare launch monitoring, incident response, customer support, and backup recovery procedures
  - _Requirements: All requirements validation_