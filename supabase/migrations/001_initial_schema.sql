-- TradeEqualizer Initial Database Schema
-- P0 MVP: MTG-only, USD pricing from TCGplayer Market, enhanced security

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Users table (extends Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'lgs')),
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Items (Card Catalog) - P0: MTG-only
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game TEXT NOT NULL DEFAULT 'mtg' CHECK (game = 'mtg'), -- P0 scope: MTG only
  name TEXT NOT NULL,
  set_code TEXT NOT NULL,
  collector_number TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  finish TEXT DEFAULT 'normal' CHECK (finish IN ('normal', 'foil', 'etched', 'showcase')),
  scryfall_id UUID,
  tcgplayer_id INTEGER,
  image_url TEXT,
  search_vector tsvector,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(scryfall_id),
  UNIQUE(tcgplayer_id)
);

-- User Inventory
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  condition TEXT NOT NULL CHECK (condition IN ('NM', 'LP', 'MP', 'HP')),
  language TEXT DEFAULT 'en',
  finish TEXT DEFAULT 'normal' CHECK (finish IN ('normal', 'foil', 'etched', 'showcase')),
  tradable BOOLEAN DEFAULT TRUE,
  acquired_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Want Lists
CREATE TABLE wants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  min_condition TEXT NOT NULL CHECK (min_condition IN ('NM', 'LP', 'MP', 'HP')),
  language_ok TEXT[] DEFAULT ARRAY['en'],
  finish_ok TEXT[] DEFAULT ARRAY['normal', 'foil', 'etched', 'showcase'],
  priority INTEGER NOT NULL CHECK (priority IN (1, 2, 3)), -- 1=Must, 2=Want, 3=Nice
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

-- Pricing Data - P0: TCGplayer Market, USD only
CREATE TABLE prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  source TEXT NOT NULL DEFAULT 'tcgplayer_market' CHECK (source = 'tcgplayer_market'), -- P0 scope: Market only
  currency TEXT DEFAULT 'USD' CHECK (currency = 'USD'), -- P0 scope: USD only
  market DECIMAL(10,2),
  low DECIMAL(10,2),
  high DECIMAL(10,2),
  condition_multipliers JSONB DEFAULT '{"NM": 1.0, "LP": 0.9, "MP": 0.75, "HP": 0.5}',
  finish_multipliers JSONB DEFAULT '{"normal": 1.0, "foil": 1.5, "etched": 1.3, "showcase": 1.2}',
  version TEXT NOT NULL, -- Price snapshot version for audit trail
  as_of TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(item_id, source, as_of)
);

-- Events (LGS)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  game TEXT NOT NULL DEFAULT 'mtg' CHECK (game = 'mtg'), -- P0 scope: MTG only
  default_price_source TEXT NOT NULL DEFAULT 'tcgplayer_market' CHECK (default_price_source = 'tcgplayer_market'),
  fairness_threshold DECIMAL(5,2) DEFAULT 5.0, -- Default ±5%
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  kiosk_mode BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event Members with privacy controls
CREATE TABLE event_members (
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'event')),
  consent_to_contact BOOLEAN DEFAULT FALSE,
  visibility_expires_at TIMESTAMPTZ, -- Auto-expire +2h after event end
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (event_id, user_id)
);

-- Trade Sessions - P0: Enhanced security with single-use tokens
CREATE TABLE trade_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code TEXT UNIQUE NOT NULL, -- Single-use token, TTL ≤ 2 minutes
  user_a_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_b_id UUID REFERENCES users(id) ON DELETE CASCADE,
  game TEXT NOT NULL DEFAULT 'mtg' CHECK (game = 'mtg'), -- P0 scope: MTG only
  price_source TEXT NOT NULL DEFAULT 'tcgplayer_market' CHECK (price_source = 'tcgplayer_market'),
  fairness_threshold DECIMAL(5,2) DEFAULT 5.0, -- Default ±5%
  currency TEXT DEFAULT 'USD' CHECK (currency = 'USD'), -- P0 scope: USD only
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'connected', 'proposing', 'completed', 'cancelled')),
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ NOT NULL, -- TTL ≤ 2 minutes for QR codes
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trade Proposals
CREATE TABLE trade_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES trade_sessions(id) ON DELETE CASCADE,
  proposed_by UUID REFERENCES users(id) ON DELETE CASCADE,
  items_from_a JSONB NOT NULL,
  items_from_b JSONB NOT NULL,
  value_a DECIMAL(10,2) NOT NULL,
  value_b DECIMAL(10,2) NOT NULL,
  coverage_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Completed Trades (immutable audit trail)
CREATE TABLE completed_trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES trade_sessions(id),
  user_a_id UUID REFERENCES users(id),
  user_b_id UUID REFERENCES users(id),
  items_from_a JSONB NOT NULL, -- Immutable snapshot with printing details
  items_from_b JSONB NOT NULL, -- Immutable snapshot with printing details
  value_a DECIMAL(10,2) NOT NULL,
  value_b DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL,
  price_source TEXT NOT NULL,
  price_version TEXT NOT NULL,
  fairness_threshold DECIMAL(5,2) NOT NULL,
  manual_overrides JSONB, -- Any manual price adjustments
  receipt_generated BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Item Reservations (concurrency control) - P0 elevated requirement
CREATE TABLE item_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_id UUID REFERENCES inventory(id) ON DELETE CASCADE,
  session_id UUID REFERENCES trade_sessions(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  reserved_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL, -- 5-minute timeout
  UNIQUE(inventory_id, session_id)
);

-- QR Code Rate Limiting - P0: 10/min/IP security requirement
CREATE TABLE qr_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address INET NOT NULL,
  created_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ip_address, window_start)
);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Usage Tracking for subscription limits
CREATE TABLE user_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  inventory_count INTEGER DEFAULT 0,
  wants_count INTEGER DEFAULT 0,
  suggestions_count INTEGER DEFAULT 0,
  events_created INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- LGS Buylist Data (P2 feature, included for future)
CREATE TABLE lgs_buylists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lgs_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  sku TEXT,
  price DECIMAL(10,2) NOT NULL,
  condition_multipliers JSONB DEFAULT '{"NM": 1.0, "LP": 0.9, "MP": 0.75, "HP": 0.5}',
  currency TEXT DEFAULT 'USD',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lgs_user_id, item_id, sku)
);