-- Database Functions and Triggers
-- TradeEqualizer utility functions and automated processes

-- Function to update search vector for items
CREATE OR REPLACE FUNCTION update_item_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', 
    COALESCE(NEW.name, '') || ' ' ||
    COALESCE(NEW.set_code, '') || ' ' ||
    COALESCE(NEW.collector_number, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update search vector
CREATE TRIGGER update_item_search_vector_trigger
  BEFORE INSERT OR UPDATE ON items
  FOR EACH ROW
  EXECUTE FUNCTION update_item_search_vector();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at columns
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trade_sessions_updated_at
  BEFORE UPDATE ON trade_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired QR codes and reservations
CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS void AS $$
BEGIN
  -- Clean up expired trade sessions
  DELETE FROM trade_sessions 
  WHERE expires_at < NOW() 
  AND status IN ('waiting', 'connected');
  
  -- Clean up expired item reservations
  DELETE FROM item_reservations 
  WHERE expires_at < NOW();
  
  -- Clean up old QR rate limit records (older than 1 hour)
  DELETE FROM qr_rate_limits 
  WHERE window_start < NOW() - INTERVAL '1 hour';
  
  -- Clean up expired event member visibility
  UPDATE event_members 
  SET visibility = 'private'
  WHERE visibility_expires_at < NOW() 
  AND visibility = 'event';
END;
$$ LANGUAGE plpgsql;

-- Function to check subscription limits
CREATE OR REPLACE FUNCTION check_subscription_limits(
  p_user_id UUID,
  p_resource_type TEXT,
  p_current_count INTEGER DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_subscription_tier TEXT;
  v_limit INTEGER;
  v_count INTEGER;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO v_subscription_tier
  FROM users WHERE id = p_user_id;
  
  -- Set limits based on tier and resource type
  CASE p_resource_type
    WHEN 'inventory' THEN
      CASE v_subscription_tier
        WHEN 'free' THEN v_limit := 100;
        ELSE v_limit := NULL; -- Unlimited for pro/lgs
      END CASE;
    WHEN 'wants' THEN
      CASE v_subscription_tier
        WHEN 'free' THEN v_limit := 50;
        ELSE v_limit := NULL; -- Unlimited for pro/lgs
      END CASE;
    WHEN 'suggestions_daily' THEN
      CASE v_subscription_tier
        WHEN 'free' THEN v_limit := 10;
        ELSE v_limit := NULL; -- Unlimited for pro/lgs
      END CASE;
    WHEN 'events_monthly' THEN
      CASE v_subscription_tier
        WHEN 'free' THEN v_limit := 1;
        WHEN 'pro' THEN v_limit := 5;
        ELSE v_limit := NULL; -- Unlimited for lgs
      END CASE;
    ELSE
      RETURN TRUE; -- Unknown resource type, allow
  END CASE;
  
  -- If unlimited, return true
  IF v_limit IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Use provided count or query current count
  IF p_current_count IS NOT NULL THEN
    v_count := p_current_count;
  ELSE
    CASE p_resource_type
      WHEN 'inventory' THEN
        SELECT COUNT(*) INTO v_count FROM inventory WHERE user_id = p_user_id;
      WHEN 'wants' THEN
        SELECT COUNT(*) INTO v_count FROM wants WHERE user_id = p_user_id;
      WHEN 'suggestions_daily' THEN
        SELECT COALESCE(suggestions_count, 0) INTO v_count 
        FROM user_usage 
        WHERE user_id = p_user_id AND date = CURRENT_DATE;
      WHEN 'events_monthly' THEN
        SELECT COUNT(*) INTO v_count 
        FROM events 
        WHERE created_by = p_user_id 
        AND created_at >= date_trunc('month', CURRENT_DATE);
      ELSE
        v_count := 0;
    END CASE;
  END IF;
  
  RETURN v_count < v_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user usage tracking
CREATE OR REPLACE FUNCTION update_user_usage(
  p_user_id UUID,
  p_resource_type TEXT,
  p_increment INTEGER DEFAULT 1
)
RETURNS void AS $$
BEGIN
  INSERT INTO user_usage (user_id, date, inventory_count, wants_count, suggestions_count, events_created)
  VALUES (
    p_user_id, 
    CURRENT_DATE,
    CASE WHEN p_resource_type = 'inventory' THEN p_increment ELSE 0 END,
    CASE WHEN p_resource_type = 'wants' THEN p_increment ELSE 0 END,
    CASE WHEN p_resource_type = 'suggestions' THEN p_increment ELSE 0 END,
    CASE WHEN p_resource_type = 'events' THEN p_increment ELSE 0 END
  )
  ON CONFLICT (user_id, date) DO UPDATE SET
    inventory_count = CASE WHEN p_resource_type = 'inventory' THEN user_usage.inventory_count + p_increment ELSE user_usage.inventory_count END,
    wants_count = CASE WHEN p_resource_type = 'wants' THEN user_usage.wants_count + p_increment ELSE user_usage.wants_count END,
    suggestions_count = CASE WHEN p_resource_type = 'suggestions' THEN user_usage.suggestions_count + p_increment ELSE user_usage.suggestions_count END,
    events_created = CASE WHEN p_resource_type = 'events' THEN user_usage.events_created + p_increment ELSE user_usage.events_created END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate unique event codes
CREATE OR REPLACE FUNCTION generate_event_code()
RETURNS TEXT AS $$
DECLARE
  v_code TEXT;
  v_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 6-character alphanumeric code
    v_code := upper(substring(md5(random()::text) from 1 for 6));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM events WHERE code = v_code) INTO v_exists;
    
    -- Exit loop if code is unique
    IF NOT v_exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN v_code;
END;
$$ LANGUAGE plpgsql;

-- Function to generate QR codes for trade sessions
CREATE OR REPLACE FUNCTION generate_qr_code()
RETURNS TEXT AS $$
DECLARE
  v_code TEXT;
  v_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 12-character alphanumeric code
    v_code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 12));
    
    -- Check if code already exists in active sessions
    SELECT EXISTS(
      SELECT 1 FROM trade_sessions 
      WHERE qr_code = v_code 
      AND expires_at > NOW()
    ) INTO v_exists;
    
    -- Exit loop if code is unique
    IF NOT v_exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN v_code;
END;
$$ LANGUAGE plpgsql;

-- Function to check QR rate limits
CREATE OR REPLACE FUNCTION check_qr_rate_limit(p_ip_address INET)
RETURNS BOOLEAN AS $$
DECLARE
  v_count INTEGER;
  v_window_start TIMESTAMPTZ;
BEGIN
  -- Calculate current minute window
  v_window_start := date_trunc('minute', NOW());
  
  -- Get or create rate limit record for this IP and window
  INSERT INTO qr_rate_limits (ip_address, window_start, created_count)
  VALUES (p_ip_address, v_window_start, 1)
  ON CONFLICT (ip_address, window_start) DO UPDATE SET
    created_count = qr_rate_limits.created_count + 1
  RETURNING created_count INTO v_count;
  
  -- Return true if under limit (10 per minute)
  RETURN v_count <= 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create audit log entry
CREATE OR REPLACE FUNCTION create_audit_log(
  p_user_id UUID,
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id, action, resource_type, resource_id, 
    details, ip_address, user_agent
  ) VALUES (
    p_user_id, p_action, p_resource_type, p_resource_id,
    p_details, p_ip_address, p_user_agent
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;