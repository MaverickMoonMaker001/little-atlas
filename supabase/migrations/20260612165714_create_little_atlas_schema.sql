/*
# Little Atlas — Full Schema

## Overview
Creates all tables needed for the Little Atlas child profile and parenting companion app.
All tables use Row Level Security scoped to the authenticated user.

## New Tables

### profiles
Mirrors auth.users. Stores per-user app preferences.
- id: references auth.users(id), primary key
- email: user's email
- weekly_reminders: boolean toggle, default true
- reminder_frequency: 'monthly' | 'quarterly' | 'manual', default 'monthly'
- created_at

### children
One row per child. Owned by a user.
- id, user_id (DEFAULT auth.uid()), name, birthdate, birth_time, birth_location,
  photo_url (public Storage URL), created_at, updated_at

### size_history
Clothing and shoe size snapshots for a child.
- id, child_id (FK children), user_id (DEFAULT auth.uid()),
  clothing_size, shoe_size, notes, recorded_at (default today), created_at

### activities
Events/activities logged for a child.
- id, child_id (FK children), user_id (DEFAULT auth.uid()),
  name, category (Sport/Education/Arts/Community/Other),
  activity_date, notes, created_at

### child_notes
Free-text notes attached to a child.
- id, child_id (FK children), user_id (DEFAULT auth.uid()),
  content, created_at, updated_at

### child_accounts
App/service account info for a child (hints only, never raw passwords).
- id, child_id (FK children), user_id (DEFAULT auth.uid()),
  platform, username, password_hint, url, created_at

## Security
- RLS enabled on every table
- 4 separate policies per table (SELECT / INSERT / UPDATE / DELETE)
- All scoped to authenticated users via auth.uid() = user_id
- user_id columns default to auth.uid() so clients can omit them on insert

## Notes
1. All statements use IF NOT EXISTS / DROP POLICY IF EXISTS for idempotency
2. Indexes added on child_id and user_id for query performance
3. ON DELETE CASCADE on child_id FKs so deleting a child removes all related data
*/

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  weekly_reminders boolean NOT NULL DEFAULT true,
  reminder_frequency text NOT NULL DEFAULT 'monthly',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- ============================================================
-- CHILDREN
-- ============================================================
CREATE TABLE IF NOT EXISTS children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  birthdate date,
  birth_time time,
  birth_location text,
  photo_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS children_user_id_idx ON children(user_id);

ALTER TABLE children ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_children" ON children;
CREATE POLICY "select_own_children" ON children FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_children" ON children;
CREATE POLICY "insert_own_children" ON children FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_children" ON children;
CREATE POLICY "update_own_children" ON children FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_children" ON children;
CREATE POLICY "delete_own_children" ON children FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- SIZE_HISTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS size_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  clothing_size text,
  shoe_size text,
  notes text,
  recorded_at date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS size_history_child_id_idx ON size_history(child_id);
CREATE INDEX IF NOT EXISTS size_history_user_id_idx ON size_history(user_id);

ALTER TABLE size_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_size_history" ON size_history;
CREATE POLICY "select_own_size_history" ON size_history FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_size_history" ON size_history;
CREATE POLICY "insert_own_size_history" ON size_history FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_size_history" ON size_history;
CREATE POLICY "update_own_size_history" ON size_history FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_size_history" ON size_history;
CREATE POLICY "delete_own_size_history" ON size_history FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- ACTIVITIES
-- ============================================================
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Other',
  activity_date date NOT NULL DEFAULT current_date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS activities_child_id_idx ON activities(child_id);
CREATE INDEX IF NOT EXISTS activities_user_id_idx ON activities(user_id);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_activities" ON activities;
CREATE POLICY "select_own_activities" ON activities FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_activities" ON activities;
CREATE POLICY "insert_own_activities" ON activities FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_activities" ON activities;
CREATE POLICY "update_own_activities" ON activities FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_activities" ON activities;
CREATE POLICY "delete_own_activities" ON activities FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- CHILD_NOTES
-- ============================================================
CREATE TABLE IF NOT EXISTS child_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS child_notes_child_id_idx ON child_notes(child_id);
CREATE INDEX IF NOT EXISTS child_notes_user_id_idx ON child_notes(user_id);

ALTER TABLE child_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_child_notes" ON child_notes;
CREATE POLICY "select_own_child_notes" ON child_notes FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_child_notes" ON child_notes;
CREATE POLICY "insert_own_child_notes" ON child_notes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_child_notes" ON child_notes;
CREATE POLICY "update_own_child_notes" ON child_notes FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_child_notes" ON child_notes;
CREATE POLICY "delete_own_child_notes" ON child_notes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- CHILD_ACCOUNTS
-- ============================================================
CREATE TABLE IF NOT EXISTS child_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  platform text NOT NULL,
  username text,
  password_hint text,
  url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS child_accounts_child_id_idx ON child_accounts(child_id);
CREATE INDEX IF NOT EXISTS child_accounts_user_id_idx ON child_accounts(user_id);

ALTER TABLE child_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_child_accounts" ON child_accounts;
CREATE POLICY "select_own_child_accounts" ON child_accounts FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_child_accounts" ON child_accounts;
CREATE POLICY "insert_own_child_accounts" ON child_accounts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_child_accounts" ON child_accounts;
CREATE POLICY "update_own_child_accounts" ON child_accounts FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_child_accounts" ON child_accounts;
CREATE POLICY "delete_own_child_accounts" ON child_accounts FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
