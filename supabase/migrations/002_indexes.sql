-- Performance Optimization Indexes
-- TradeEqualizer Database Indexes for P0 MVP

-- Items table indexes for search performance
CREATE INDEX items_search_idx ON items USING GIN(search_vector);
CREATE INDEX items_name_idx ON items(name);
CREATE INDEX items_set_idx ON items(set_code);
CREATE INDEX items_game_idx ON items(game);
CREATE INDEX items_scryfall_idx ON items(scryfall_id) WHERE scryfall_id IS NOT NULL;
CREATE INDEX items_tcgplayer_idx ON items(tcgplayer_id) WHERE tcgplayer_id IS NOT NULL;

-- Inventory indexes for user queries and matching
CREATE INDEX inventory_user_idx ON inventory(user_id);
CREATE INDEX inventory_tradable_idx ON inventory(user_id, tradable) WHERE tradable = TRUE;
CREATE INDEX inventory_item_idx ON inventory(item_id);
CREATE INDEX inventory_user_item_idx ON inventory(user_id, item_id);
CREATE INDEX inventory_condition_idx ON inventory(condition);
CREATE INDEX inventory_finish_idx ON inventory(finish);

-- Want lists indexes for matching algorithm
CREATE INDEX wants_user_idx ON wants(user_id);
CREATE INDEX wants_priority_idx ON wants(user_id, priority);
CREATE INDEX wants_item_idx ON wants(item_id);
CREATE INDEX wants_user_item_idx ON wants(user_id, item_id);

-- Pricing indexes for fast lookups
CREATE INDEX prices_item_idx ON prices(item_id);
CREATE INDEX prices_date_idx ON prices(as_of DESC);
CREATE INDEX prices_source_idx ON prices(source);
CREATE INDEX prices_item_source_idx ON prices(item_id, source);
CREATE INDEX prices_latest_idx ON prices(item_id, source, as_of DESC);

-- Trade sessions indexes for QR and user lookups
CREATE INDEX trade_sessions_qr_idx ON trade_sessions(qr_code);
CREATE INDEX trade_sessions_users_idx ON trade_sessions(user_a_id, user_b_id);
CREATE INDEX trade_sessions_event_idx ON trade_sessions(event_id);
CREATE INDEX trade_sessions_status_idx ON trade_sessions(status);
CREATE INDEX trade_sessions_expires_idx ON trade_sessions(expires_at);

-- Events indexes for active event queries
CREATE INDEX events_code_idx ON events(code);
CREATE INDEX events_active_idx ON events(is_active) WHERE is_active = TRUE;
CREATE INDEX events_creator_idx ON events(created_by);
CREATE INDEX events_dates_idx ON events(start_date, end_date);

-- Event members indexes for privacy and matching
CREATE INDEX event_members_event_idx ON event_members(event_id);
CREATE INDEX event_members_user_idx ON event_members(user_id);
CREATE INDEX event_members_visibility_idx ON event_members(event_id, visibility) WHERE visibility = 'event';
CREATE INDEX event_members_expires_idx ON event_members(visibility_expires_at);

-- Trade proposals indexes for session queries
CREATE INDEX trade_proposals_session_idx ON trade_proposals(session_id);
CREATE INDEX trade_proposals_proposer_idx ON trade_proposals(proposed_by);
CREATE INDEX trade_proposals_status_idx ON trade_proposals(status);
CREATE INDEX trade_proposals_created_idx ON trade_proposals(created_at DESC);

-- Completed trades indexes for audit and history
CREATE INDEX completed_trades_users_idx ON completed_trades(user_a_id, user_b_id);
CREATE INDEX completed_trades_date_idx ON completed_trades(completed_at DESC);
CREATE INDEX completed_trades_session_idx ON completed_trades(session_id);

-- Item reservations indexes for concurrency control
CREATE INDEX item_reservations_expires_idx ON item_reservations(expires_at);
CREATE INDEX item_reservations_inventory_idx ON item_reservations(inventory_id);
CREATE INDEX item_reservations_session_idx ON item_reservations(session_id);

-- QR rate limiting indexes for security
CREATE INDEX qr_rate_limits_ip_window_idx ON qr_rate_limits(ip_address, window_start);
CREATE INDEX qr_rate_limits_window_idx ON qr_rate_limits(window_start) WHERE window_start > NOW() - INTERVAL '1 minute';

-- Audit logs indexes for monitoring
CREATE INDEX audit_logs_user_idx ON audit_logs(user_id);
CREATE INDEX audit_logs_action_idx ON audit_logs(action);
CREATE INDEX audit_logs_created_idx ON audit_logs(created_at DESC);
CREATE INDEX audit_logs_resource_idx ON audit_logs(resource_type, resource_id);

-- User usage indexes for subscription enforcement
CREATE INDEX user_usage_user_date_idx ON user_usage(user_id, date);
CREATE INDEX user_usage_date_idx ON user_usage(date DESC);

-- LGS buylist indexes (for P2 features)
CREATE INDEX lgs_buylists_lgs_idx ON lgs_buylists(lgs_user_id);
CREATE INDEX lgs_buylists_item_idx ON lgs_buylists(item_id);
CREATE INDEX lgs_buylists_sku_idx ON lgs_buylists(sku);

-- Composite indexes for common query patterns
CREATE INDEX inventory_user_tradable_condition_idx ON inventory(user_id, tradable, condition) WHERE tradable = TRUE;
CREATE INDEX wants_user_priority_item_idx ON wants(user_id, priority, item_id);
CREATE INDEX prices_item_source_latest_idx ON prices(item_id, source, as_of DESC);
CREATE INDEX trade_sessions_active_idx ON trade_sessions(status, expires_at) WHERE status IN ('waiting', 'connected', 'proposing');

-- Full-text search optimization for items
CREATE INDEX items_name_trgm_idx ON items USING GIN(name gin_trgm_ops);
CREATE INDEX items_set_trgm_idx ON items USING GIN(set_code gin_trgm_ops);