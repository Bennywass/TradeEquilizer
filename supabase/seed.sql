-- TradeEqualizer Sample Data Seed
-- Sample MTG card data for testing and development

-- Insert sample MTG cards from popular sets
INSERT INTO items (name, set_code, collector_number, language, finish, scryfall_id, tcgplayer_id, image_url) VALUES
-- Lightning Bolt variants
('Lightning Bolt', 'M21', '162', 'en', 'normal', 'ce711608-f9ca-4570-8179-9a6b6b6d7b8a', 220000, 'https://cards.scryfall.io/normal/front/c/e/ce711608-f9ca-4570-8179-9a6b6b6d7b8a.jpg'),
('Lightning Bolt', 'M21', '162', 'en', 'foil', 'ce711608-f9ca-4570-8179-9a6b6b6d7b8a', 220001, 'https://cards.scryfall.io/normal/front/c/e/ce711608-f9ca-4570-8179-9a6b6b6d7b8a.jpg'),

-- Black Lotus (iconic card)
('Black Lotus', 'LEA', '232', 'en', 'normal', '310d9c5e-842f-47b2-9d0e-d4f2b8b4b4b4', 300000, 'https://cards.scryfall.io/normal/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg'),

-- Counterspell variants
('Counterspell', 'M21', '267', 'en', 'normal', '685673f8-2a35-4b6c-b5d2-2b2e2b2e2b2e', 220100, 'https://cards.scryfall.io/normal/front/6/8/685673f8-2a35-4b6c-b5d2-2b2e2b2e2b2e.jpg'),
('Counterspell', 'TSR', '60', 'en', 'normal', '1b73a83b-5d3c-4b8f-9b8f-9b8f9b8f9b8f', 220101, 'https://cards.scryfall.io/normal/front/1/b/1b73a83b-5d3c-4b8f-9b8f-9b8f9b8f9b8f.jpg'),

-- Sol Ring variants
('Sol Ring', 'C21', '263', 'en', 'normal', '3c7a7b7b-7b7b-7b7b-7b7b-7b7b7b7b7b7b', 220200, 'https://cards.scryfall.io/normal/front/3/c/3c7a7b7b-7b7b-7b7b-7b7b-7b7b7b7b7b7b.jpg'),
('Sol Ring', 'C21', '263', 'en', 'etched', '3c7a7b7b-7b7b-7b7b-7b7b-7b7b7b7b7b7b', 220201, 'https://cards.scryfall.io/normal/front/3/c/3c7a7b7b-7b7b-7b7b-7b7b-7b7b7b7b7b7b.jpg'),

-- Planeswalkers
('Jace, the Mind Sculptor', 'WWK', '31', 'en', 'normal', '4e4a4e4e-4e4e-4e4e-4e4e-4e4e4e4e4e4e', 220300, 'https://cards.scryfall.io/normal/front/4/e/4e4a4e4e-4e4e-4e4e-4e4e-4e4e4e4e4e4e.jpg'),
('Liliana of the Veil', 'ISD', '105', 'en', 'normal', '5f5f5f5f-5f5f-5f5f-5f5f-5f5f5f5f5f5f', 220400, 'https://cards.scryfall.io/normal/front/5/f/5f5f5f5f-5f5f-5f5f-5f5f-5f5f5f5f5f5f.jpg'),

-- Dual Lands
('Underground Sea', 'LEA', '287', 'en', 'normal', '6a6a6a6a-6a6a-6a6a-6a6a-6a6a6a6a6a6a', 220500, 'https://cards.scryfall.io/normal/front/6/a/6a6a6a6a-6a6a-6a6a-6a6a-6a6a6a6a6a6a.jpg'),
('Tropical Island', 'LEA', '284', 'en', 'normal', '7b7b7b7b-7b7b-7b7b-7b7b-7b7b7b7b7b7b', 220600, 'https://cards.scryfall.io/normal/front/7/b/7b7b7b7b-7b7b-7b7b-7b7b-7b7b7b7b7b7b.jpg'),

-- Modern staples
('Tarmogoyf', 'FUT', '153', 'en', 'normal', '8c8c8c8c-8c8c-8c8c-8c8c-8c8c8c8c8c8c', 220700, 'https://cards.scryfall.io/normal/front/8/c/8c8c8c8c-8c8c-8c8c-8c8c-8c8c8c8c8c8c.jpg'),
('Snapcaster Mage', 'ISD', '78', 'en', 'normal', '9d9d9d9d-9d9d-9d9d-9d9d-9d9d9d9d9d9d', 220800, 'https://cards.scryfall.io/normal/front/9/d/9d9d9d9d-9d9d-9d9d-9d9d-9d9d9d9d9d9d.jpg'),

-- Budget cards for testing
('Shock', 'M21', '159', 'en', 'normal', 'aeaeaeae-aeae-aeae-aeae-aeaeaeaeaeae', 220900, 'https://cards.scryfall.io/normal/front/a/e/aeaeaeae-aeae-aeae-aeae-aeaeaeaeaeae.jpg'),
('Negate', 'M21', '59', 'en', 'normal', 'bfbfbfbf-bfbf-bfbf-bfbf-bfbfbfbfbfbf', 221000, 'https://cards.scryfall.io/normal/front/b/f/bfbfbfbf-bfbf-bfbf-bfbf-bfbfbfbfbfbf.jpg'),

-- Commander staples
('Command Tower', 'C21', '284', 'en', 'normal', 'c0c0c0c0-c0c0-c0c0-c0c0-c0c0c0c0c0c0', 221100, 'https://cards.scryfall.io/normal/front/c/0/c0c0c0c0-c0c0-c0c0-c0c0-c0c0c0c0c0c0.jpg'),
('Arcane Signet', 'C21', '234', 'en', 'normal', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d1d1', 221200, 'https://cards.scryfall.io/normal/front/d/1/d1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d1d1.jpg'),

-- Different languages for testing
('Lightning Bolt', 'M21', '162', 'ja', 'normal', 'ce711608-f9ca-4570-8179-9a6b6b6d7b8a', 220002, 'https://cards.scryfall.io/normal/front/c/e/ce711608-f9ca-4570-8179-9a6b6b6d7b8a.jpg'),
('Lightning Bolt', 'M21', '162', 'de', 'normal', 'ce711608-f9ca-4570-8179-9a6b6b6d7b8a', 220003, 'https://cards.scryfall.io/normal/front/c/e/ce711608-f9ca-4570-8179-9a6b6b6d7b8a.jpg'),

-- Showcase/special treatments
('Teferi, Time Raveler', 'WAR', '221', 'en', 'showcase', 'e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2', 221300, 'https://cards.scryfall.io/normal/front/e/2/e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2.jpg'),
('Brainstorm', 'STA', '13', 'en', 'etched', 'f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f3f3', 221400, 'https://cards.scryfall.io/normal/front/f/3/f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f3f3.jpg');

-- Insert sample pricing data for the cards
INSERT INTO prices (item_id, source, currency, market, low, high, version, as_of) 
SELECT 
  i.id,
  'tcgplayer_market',
  'USD',
  CASE 
    WHEN i.name = 'Black Lotus' THEN 25000.00
    WHEN i.name = 'Underground Sea' THEN 450.00
    WHEN i.name = 'Tropical Island' THEN 380.00
    WHEN i.name = 'Jace, the Mind Sculptor' THEN 85.00
    WHEN i.name = 'Liliana of the Veil' THEN 65.00
    WHEN i.name = 'Tarmogoyf' THEN 45.00
    WHEN i.name = 'Snapcaster Mage' THEN 25.00
    WHEN i.name = 'Lightning Bolt' AND i.finish = 'foil' THEN 8.00
    WHEN i.name = 'Lightning Bolt' THEN 0.50
    WHEN i.name = 'Counterspell' THEN 0.25
    WHEN i.name = 'Sol Ring' AND i.finish = 'etched' THEN 12.00
    WHEN i.name = 'Sol Ring' THEN 2.00
    WHEN i.name = 'Command Tower' THEN 0.75
    WHEN i.name = 'Arcane Signet' THEN 1.50
    WHEN i.name = 'Shock' THEN 0.15
    WHEN i.name = 'Negate' THEN 0.10
    WHEN i.name = 'Teferi, Time Raveler' THEN 18.00
    WHEN i.name = 'Brainstorm' THEN 3.50
    ELSE 1.00
  END as market_price,
  CASE 
    WHEN i.name = 'Black Lotus' THEN 22000.00
    WHEN i.name = 'Underground Sea' THEN 400.00
    WHEN i.name = 'Tropical Island' THEN 340.00
    WHEN i.name = 'Jace, the Mind Sculptor' THEN 75.00
    WHEN i.name = 'Liliana of the Veil' THEN 58.00
    WHEN i.name = 'Tarmogoyf' THEN 40.00
    WHEN i.name = 'Snapcaster Mage' THEN 22.00
    WHEN i.name = 'Lightning Bolt' AND i.finish = 'foil' THEN 6.50
    WHEN i.name = 'Lightning Bolt' THEN 0.35
    WHEN i.name = 'Counterspell' THEN 0.20
    WHEN i.name = 'Sol Ring' AND i.finish = 'etched' THEN 10.00
    WHEN i.name = 'Sol Ring' THEN 1.50
    WHEN i.name = 'Command Tower' THEN 0.50
    WHEN i.name = 'Arcane Signet' THEN 1.25
    WHEN i.name = 'Shock' THEN 0.10
    WHEN i.name = 'Negate' THEN 0.08
    WHEN i.name = 'Teferi, Time Raveler' THEN 15.00
    WHEN i.name = 'Brainstorm' THEN 3.00
    ELSE 0.75
  END as low_price,
  CASE 
    WHEN i.name = 'Black Lotus' THEN 30000.00
    WHEN i.name = 'Underground Sea' THEN 500.00
    WHEN i.name = 'Tropical Island' THEN 420.00
    WHEN i.name = 'Jace, the Mind Sculptor' THEN 95.00
    WHEN i.name = 'Liliana of the Veil' THEN 72.00
    WHEN i.name = 'Tarmogoyf' THEN 50.00
    WHEN i.name = 'Snapcaster Mage' THEN 28.00
    WHEN i.name = 'Lightning Bolt' AND i.finish = 'foil' THEN 10.00
    WHEN i.name = 'Lightning Bolt' THEN 0.75
    WHEN i.name = 'Counterspell' THEN 0.35
    WHEN i.name = 'Sol Ring' AND i.finish = 'etched' THEN 15.00
    WHEN i.name = 'Sol Ring' THEN 2.50
    WHEN i.name = 'Command Tower' THEN 1.00
    WHEN i.name = 'Arcane Signet' THEN 2.00
    WHEN i.name = 'Shock' THEN 0.25
    WHEN i.name = 'Negate' THEN 0.15
    WHEN i.name = 'Teferi, Time Raveler' THEN 22.00
    WHEN i.name = 'Brainstorm' THEN 4.00
    ELSE 1.50
  END as high_price,
  'v1.0.0',
  NOW()
FROM items i;

-- Create a test user (this would normally be handled by Supabase Auth)
-- Note: In production, users are created through Supabase Auth, this is just for testing
INSERT INTO users (id, email, name, subscription_tier) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'test@example.com', 'Test User', 'free'),
('550e8400-e29b-41d4-a716-446655440001', 'pro@example.com', 'Pro User', 'pro'),
('550e8400-e29b-41d4-a716-446655440002', 'lgs@example.com', 'LGS Owner', 'lgs');

-- Add sample inventory for test user
INSERT INTO inventory (user_id, item_id, quantity, condition, language, finish, tradable)
SELECT 
  '550e8400-e29b-41d4-a716-446655440000',
  i.id,
  CASE 
    WHEN i.name IN ('Lightning Bolt', 'Shock', 'Negate') THEN 4
    WHEN i.name IN ('Sol Ring', 'Command Tower') THEN 2
    WHEN i.name = 'Counterspell' THEN 3
    ELSE 1
  END,
  CASE 
    WHEN random() < 0.6 THEN 'NM'
    WHEN random() < 0.8 THEN 'LP'
    WHEN random() < 0.95 THEN 'MP'
    ELSE 'HP'
  END,
  i.language,
  i.finish,
  CASE WHEN i.name = 'Black Lotus' THEN false ELSE true END -- Keep Black Lotus non-tradable
FROM items i
WHERE i.name IN ('Lightning Bolt', 'Sol Ring', 'Counterspell', 'Shock', 'Command Tower', 'Black Lotus', 'Snapcaster Mage');

-- Add sample want list for test user
INSERT INTO wants (user_id, item_id, quantity, min_condition, language_ok, finish_ok, priority)
SELECT 
  '550e8400-e29b-41d4-a716-446655440000',
  i.id,
  CASE 
    WHEN i.name IN ('Tarmogoyf', 'Jace, the Mind Sculptor') THEN 1
    WHEN i.name = 'Underground Sea' THEN 2
    ELSE 4
  END,
  CASE 
    WHEN i.name IN ('Underground Sea', 'Jace, the Mind Sculptor') THEN 'LP'
    ELSE 'MP'
  END,
  ARRAY['en'],
  CASE 
    WHEN i.name = 'Lightning Bolt' THEN ARRAY['normal', 'foil']
    ELSE ARRAY['normal']
  END,
  CASE 
    WHEN i.name IN ('Tarmogoyf', 'Underground Sea') THEN 1 -- Must have
    WHEN i.name = 'Jace, the Mind Sculptor' THEN 2 -- Want
    ELSE 3 -- Nice to have
  END
FROM items i
WHERE i.name IN ('Tarmogoyf', 'Underground Sea', 'Jace, the Mind Sculptor', 'Liliana of the Veil', 'Tropical Island', 'Arcane Signet');

-- Add sample inventory for pro user (different cards)
INSERT INTO inventory (user_id, item_id, quantity, condition, language, finish, tradable)
SELECT 
  '550e8400-e29b-41d4-a716-446655440001',
  i.id,
  CASE 
    WHEN i.name = 'Tarmogoyf' THEN 2
    WHEN i.name = 'Underground Sea' THEN 1
    ELSE 1
  END,
  'NM',
  i.language,
  i.finish,
  true
FROM items i
WHERE i.name IN ('Tarmogoyf', 'Underground Sea', 'Jace, the Mind Sculptor', 'Liliana of the Veil', 'Arcane Signet', 'Brainstorm');

-- Add sample want list for pro user
INSERT INTO wants (user_id, item_id, quantity, min_condition, language_ok, finish_ok, priority)
SELECT 
  '550e8400-e29b-41d4-a716-446655440001',
  i.id,
  CASE 
    WHEN i.name = 'Lightning Bolt' THEN 4
    ELSE 1
  END,
  'LP',
  ARRAY['en'],
  ARRAY['normal', 'foil'],
  CASE 
    WHEN i.name = 'Lightning Bolt' THEN 1 -- Must have
    WHEN i.name = 'Sol Ring' THEN 2 -- Want
    ELSE 3 -- Nice to have
  END
FROM items i
WHERE i.name IN ('Lightning Bolt', 'Sol Ring', 'Snapcaster Mage', 'Command Tower');

-- Create a sample event
INSERT INTO events (name, code, created_by, start_date, end_date, is_active)
VALUES (
  'Friday Night Magic',
  'FNM001',
  '550e8400-e29b-41d4-a716-446655440002',
  NOW(),
  NOW() + INTERVAL '4 hours',
  true
);

-- Add event members
INSERT INTO event_members (event_id, user_id, visibility, consent_to_contact, visibility_expires_at)
SELECT 
  e.id,
  u.id,
  CASE WHEN u.subscription_tier = 'free' THEN 'private' ELSE 'event' END,
  CASE WHEN u.subscription_tier != 'free' THEN true ELSE false END,
  e.end_date + INTERVAL '2 hours'
FROM events e, users u
WHERE e.code = 'FNM001';

-- Initialize user usage tracking
INSERT INTO user_usage (user_id, date, inventory_count, wants_count, suggestions_count, events_created)
SELECT 
  u.id,
  CURRENT_DATE,
  COALESCE(inv_count.count, 0),
  COALESCE(want_count.count, 0),
  0,
  CASE WHEN u.subscription_tier = 'lgs' THEN 1 ELSE 0 END
FROM users u
LEFT JOIN (
  SELECT user_id, COUNT(*) as count 
  FROM inventory 
  GROUP BY user_id
) inv_count ON u.id = inv_count.user_id
LEFT JOIN (
  SELECT user_id, COUNT(*) as count 
  FROM wants 
  GROUP BY user_id
) want_count ON u.id = want_count.user_id;