-- TradeEqualizer Database Setup Script
-- Run this script to set up the complete database schema

-- This script combines all migrations and seed data for easy setup
-- In production, use individual migration files with proper versioning

\echo 'Setting up TradeEqualizer database...'

-- Run initial schema
\i supabase/migrations/001_initial_schema.sql
\echo 'Initial schema created ✓'

-- Add indexes
\i supabase/migrations/002_indexes.sql
\echo 'Performance indexes created ✓'

-- Set up RLS policies
\i supabase/migrations/003_rls_policies.sql
\echo 'Row-level security policies configured ✓'

-- Add functions and triggers
\i supabase/migrations/004_functions_triggers.sql
\echo 'Database functions and triggers created ✓'

-- Seed sample data
\i supabase/seed.sql
\echo 'Sample data seeded ✓'

\echo 'Database setup complete! 🎉'
\echo ''
\echo 'Sample users created:'
\echo '- test@example.com (Free tier)'
\echo '- pro@example.com (Pro tier)'  
\echo '- lgs@example.com (LGS tier)'
\echo ''
\echo 'Sample MTG cards and pricing data loaded'
\echo 'Sample inventory and want lists created'
\echo 'Sample event "FNM001" created'