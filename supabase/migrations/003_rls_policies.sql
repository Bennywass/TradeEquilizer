-- Row Level Security Policies
-- TradeEqualizer RLS for data protection (Requirement 8.1)

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE wants ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE lgs_buylists ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Items table policies (public read for catalog)
CREATE POLICY "Items are publicly readable" ON items
  FOR SELECT USING (true);

-- Only admins can modify items (for future admin functionality)
CREATE POLICY "Only admins can modify items" ON items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND subscription_tier = 'admin'
    )
  );

-- Inventory table policies
CREATE POLICY "Users can view their own inventory" ON inventory
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own inventory" ON inventory
  FOR ALL USING (auth.uid() = user_id);

-- Want lists policies
CREATE POLICY "Users can view their own wants" ON wants
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own wants" ON wants
  FOR ALL USING (auth.uid() = user_id);

-- Prices table policies (read-only for users, no direct access)
CREATE POLICY "Prices are readable by authenticated users" ON prices
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only system can modify prices
CREATE POLICY "Only system can modify prices" ON prices
  FOR ALL USING (auth.role() = 'service_role');

-- Events table policies
CREATE POLICY "Users can view active events" ON events
  FOR SELECT USING (is_active = true);

CREATE POLICY "LGS users can create events" ON events
  FOR INSERT WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND subscription_tier IN ('lgs', 'admin')
    )
  );

CREATE POLICY "Event creators can manage their events" ON events
  FOR ALL USING (auth.uid() = created_by);

-- Event members policies
CREATE POLICY "Users can view event members with proper visibility" ON event_members
  FOR SELECT USING (
    -- User can see their own membership
    auth.uid() = user_id OR
    -- User can see other members if they're in the same event and visibility allows
    (
      visibility = 'event' AND
      (visibility_expires_at IS NULL OR visibility_expires_at > NOW()) AND
      EXISTS (
        SELECT 1 FROM event_members em2 
        WHERE em2.event_id = event_members.event_id 
        AND em2.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can manage their own event membership" ON event_members
  FOR ALL USING (auth.uid() = user_id);

-- Trade sessions policies
CREATE POLICY "Users can view their own trade sessions" ON trade_sessions
  FOR SELECT USING (
    auth.uid() = user_a_id OR 
    auth.uid() = user_b_id
  );

CREATE POLICY "Users can create trade sessions" ON trade_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_a_id);

CREATE POLICY "Session participants can update sessions" ON trade_sessions
  FOR UPDATE USING (
    auth.uid() = user_a_id OR 
    auth.uid() = user_b_id
  );

-- Trade proposals policies
CREATE POLICY "Session participants can view proposals" ON trade_proposals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM trade_sessions ts 
      WHERE ts.id = session_id 
      AND (ts.user_a_id = auth.uid() OR ts.user_b_id = auth.uid())
    )
  );

CREATE POLICY "Session participants can create proposals" ON trade_proposals
  FOR INSERT WITH CHECK (
    auth.uid() = proposed_by AND
    EXISTS (
      SELECT 1 FROM trade_sessions ts 
      WHERE ts.id = session_id 
      AND (ts.user_a_id = auth.uid() OR ts.user_b_id = auth.uid())
    )
  );

CREATE POLICY "Session participants can update proposals" ON trade_proposals
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM trade_sessions ts 
      WHERE ts.id = session_id 
      AND (ts.user_a_id = auth.uid() OR ts.user_b_id = auth.uid())
    )
  );

-- Completed trades policies (read-only audit trail)
CREATE POLICY "Users can view their completed trades" ON completed_trades
  FOR SELECT USING (
    auth.uid() = user_a_id OR 
    auth.uid() = user_b_id
  );

-- Only system can insert completed trades
CREATE POLICY "Only system can create completed trades" ON completed_trades
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Item reservations policies
CREATE POLICY "Users can view reservations for their inventory" ON item_reservations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM inventory i 
      WHERE i.id = inventory_id 
      AND i.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM trade_sessions ts 
      WHERE ts.id = session_id 
      AND (ts.user_a_id = auth.uid() OR ts.user_b_id = auth.uid())
    )
  );

CREATE POLICY "System can manage reservations" ON item_reservations
  FOR ALL USING (auth.role() = 'service_role');

-- QR rate limits policies (system only)
CREATE POLICY "Only system can manage QR rate limits" ON qr_rate_limits
  FOR ALL USING (auth.role() = 'service_role');

-- Audit logs policies
CREATE POLICY "Users can view their own audit logs" ON audit_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Only system can create audit logs
CREATE POLICY "Only system can create audit logs" ON audit_logs
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- User usage policies
CREATE POLICY "Users can view their own usage" ON user_usage
  FOR SELECT USING (auth.uid() = user_id);

-- Only system can manage usage tracking
CREATE POLICY "Only system can manage usage tracking" ON user_usage
  FOR ALL USING (auth.role() = 'service_role');

-- LGS buylist policies
CREATE POLICY "LGS users can view their own buylists" ON lgs_buylists
  FOR SELECT USING (auth.uid() = lgs_user_id);

CREATE POLICY "LGS users can manage their own buylists" ON lgs_buylists
  FOR ALL USING (
    auth.uid() = lgs_user_id AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND subscription_tier IN ('lgs', 'admin')
    )
  );