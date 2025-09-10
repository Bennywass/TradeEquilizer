# TradeEqualizer Database Schema Documentation

## Overview

The TradeEqualizer database is designed for P0 MVP with MTG-only support, USD pricing from TCGplayer Market, and enhanced security features. The schema supports the core trading functionality while maintaining data integrity and performance.

## Core Tables

### Users
Extends Supabase Auth with subscription and profile information.
- **Primary Key**: `id` (UUID, references auth.users)
- **Subscription Tiers**: free, pro, lgs
- **RLS**: Users can only access their own data

### Items (Card Catalog)
MTG card catalog with search optimization.
- **P0 Scope**: MTG-only (`game = 'mtg'`)
- **Search**: Full-text search via `search_vector`
- **Variants**: Language, finish (normal/foil/etched/showcase)
- **External IDs**: Scryfall and TCGplayer integration

### Inventory
User's tradable card collection.
- **Ownership**: Linked to users via `user_id`
- **Variants**: Condition, language, finish tracking
- **Trading**: `tradable` flag for availability
- **Limits**: Free tier limited to 100 items

### Wants
User's want lists with priorities and constraints.
- **Priorities**: 1=Must, 2=Want, 3=Nice
- **Constraints**: Min condition, language preferences, finish options
- **Limits**: Free tier limited to 50 wants

### Prices
Market pricing data with audit trail.
- **P0 Scope**: TCGplayer Market, USD only
- **Multipliers**: Condition and finish price adjustments
- **Versioning**: Price snapshot versions for trade audit
- **Caching**: Optimized for fast lookups

### Trade Sessions
QR-based trading sessions with enhanced security.
- **Security**: Single-use QR codes, 2-minute TTL
- **Rate Limiting**: 10 sessions per minute per IP
- **Scope**: Event-based or direct trading
- **Status**: waiting → connected → proposing → completed

### Events
LGS event management with privacy controls.
- **Access**: LGS tier users can create events
- **Privacy**: Default private visibility with explicit opt-in
- **Scoping**: Trade matching limited to event participants

## Security Features

### Row Level Security (RLS)
All tables have RLS policies enforcing data access controls:
- Users can only access their own data
- Event visibility respects privacy settings
- System operations use service role

### Rate Limiting
- QR code generation: 10 per minute per IP
- Tracked in `qr_rate_limits` table
- Automatic cleanup of old records

### Audit Trail
- All trade actions logged in `audit_logs`
- Immutable trade records in `completed_trades`
- Price version tracking for reproducibility

## Performance Optimizations

### Indexes
- Full-text search on item names and sets
- Composite indexes for common query patterns
- Partial indexes for active/tradable records
- GIN indexes for JSONB and array columns

### Caching Strategy
- Price data cached with Redis
- Search vectors pre-computed
- Usage tracking for subscription limits

## Subscription Limits

### Free Tier
- 100 inventory items
- 50 want list items
- 10 suggestions per day
- 1 event per month

### Pro Tier
- Unlimited inventory and wants
- Unlimited suggestions
- 5 events per month
- Notifications enabled

### LGS Tier
- All Pro features
- Unlimited events
- Kiosk mode access
- Event management tools

## Data Integrity

### Constraints
- Check constraints on enums (condition, finish, etc.)
- Foreign key relationships maintained
- Unique constraints on critical fields

### Triggers
- Automatic search vector updates
- Timestamp management
- Data validation

### Functions
- Subscription limit checking
- Usage tracking updates
- Cleanup operations for expired data

## Migration Strategy

### File Organization
1. `001_initial_schema.sql` - Core table definitions
2. `002_indexes.sql` - Performance optimization
3. `003_rls_policies.sql` - Security policies
4. `004_functions_triggers.sql` - Business logic

### Deployment
- Use Supabase CLI for production migrations
- Test migrations on staging environment
- Backup before major schema changes

## Sample Data

The seed file includes:
- 16 popular MTG cards with variants
- Realistic pricing data
- 3 test users (free, pro, lgs tiers)
- Sample inventory and want lists
- Test event with members

## Future Considerations

### P1/P2 Expansions
- Multi-TCG support (Pokemon, Yu-Gi-Oh, etc.)
- Multi-currency pricing
- LGS buylist integration
- Enhanced offline capabilities

### Scalability
- Partitioning for large datasets
- Read replicas for analytics
- Archival strategy for old trades

## Monitoring

### Health Checks
- Database connection status
- Query performance metrics
- Storage usage tracking
- RLS policy effectiveness

### Alerts
- Failed migrations
- Performance degradation
- Security policy violations
- Subscription limit breaches