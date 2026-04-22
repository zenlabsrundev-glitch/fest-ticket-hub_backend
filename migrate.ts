import * as dotenv from "dotenv";
dotenv.config();

import { Client } from "pg";

const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 6543,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

const sql = `
-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  emoji TEXT,
  description TEXT,
  team_size TEXT,
  color_theme TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY,
  team_name TEXT NOT NULL,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  leader_name TEXT NOT NULL,
  leader_email TEXT NOT NULL,
  leader_phone TEXT,
  leader_college TEXT,
  team_members JSONB DEFAULT '[]',
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- In case it already exists but missing event_id
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES events(id) ON DELETE CASCADE;

-- Admin users table (for signup/login)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table for global app config (like timer)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial countdown date
INSERT INTO settings (key, value) 
VALUES ('fest_start_date', '2025-03-15T09:00:00')
ON CONFLICT (key) DO NOTHING;
`;

async function migrate() {
  try {
    console.log("🔌 Connecting to Supabase Postgres...");
    await client.connect();
    console.log("✅ Connected!");

    console.log("📦 Creating tables...");
    await client.query(sql);
    console.log("✅ Tables created successfully!");
    console.log("   - events");
    console.log("   - registrations");
    console.log("   - admin_users");
  } catch (err: any) {
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log("🔌 Connection closed.");
  }
}

migrate();
