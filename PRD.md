---
title: Little Atlas — Product Requirements Document
version: 1.0
date: 2026-06-12
status: active
---

# Little Atlas PRD

A private child profile and parenting companion app. Parents track each child's key
details, sizes, activities, accounts, notes, and weekly insights in one private place.

---

## 1. Current State

### Already Built
- All 6 routes: `/`, `/add-child`, `/child/:id`, `/home`, `/insights`, `/settings`
- BottomNav component (Home, Insights, Settings)
- ChildProfile with 4-tab system (Overview, Astrology, Physical, Activities)
- Physical tab with size history timeline
- Insights page structure
- Settings UI with toggles and frequency selector
- All Tailwind design tokens: `cream-*`, `atlas-*`, Lora + Inter fonts

### All Mock / Not Yet Wired
- `src/data/mockData.js` — 3 hardcoded children; must be deleted once replaced
- All form submits (AddChild, PhysicalTab add form)
- All quick action buttons (Add Size, Log Activity, Add Account, Add Note)
- Edit Profile button
- Log Out, Change Password, Export Data
- Activities tab (shows "Coming Soon")
- Astrology tab (shows "Coming Soon")

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 5 + Tailwind CSS 3 |
| Backend | Supabase (auth + Postgres + Storage) |
| State | React context (auth) + local useState/useEffect per page |
| Routing | React Router v7 |

---

## 3. Database Schema

### 3.1 profiles
Mirrors `auth.users`. Stores app preferences per user.

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, references auth.users(id) |
| email | text | |
| weekly_reminders | boolean | default true |
| reminder_frequency | text | 'monthly' \| 'quarterly' \| 'manual', default 'monthly' |
| created_at | timestamptz | default now() |

### 3.2 children
One row per child, owned by a user.

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| user_id | uuid | FK auth.users, NOT NULL DEFAULT auth.uid() |
| name | text | NOT NULL |
| birthdate | date | |
| birth_time | time | |
| birth_location | text | |
| photo_url | text | Public URL from Storage |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

### 3.3 size_history

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| child_id | uuid | FK children(id) ON DELETE CASCADE |
| user_id | uuid | NOT NULL DEFAULT auth.uid() |
| clothing_size | text | |
| shoe_size | text | |
| notes | text | |
| recorded_at | date | default current_date |
| created_at | timestamptz | default now() |

### 3.4 activities

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| child_id | uuid | FK children(id) ON DELETE CASCADE |
| user_id | uuid | NOT NULL DEFAULT auth.uid() |
| name | text | NOT NULL |
| category | text | Sport \| Education \| Arts \| Community \| Other |
| activity_date | date | NOT NULL |
| notes | text | |
| created_at | timestamptz | default now() |

### 3.5 child_notes

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| child_id | uuid | FK children(id) ON DELETE CASCADE |
| user_id | uuid | NOT NULL DEFAULT auth.uid() |
| content | text | NOT NULL |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

### 3.6 child_accounts

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| child_id | uuid | FK children(id) ON DELETE CASCADE |
| user_id | uuid | NOT NULL DEFAULT auth.uid() |
| platform | text | NOT NULL (e.g. "School Portal") |
| username | text | |
| password_hint | text | Hint only — never actual password |
| url | text | Optional |
| created_at | timestamptz | default now() |

### 3.7 RLS Pattern (all tables)
Four separate policies per table scoped to `authenticated`:
- SELECT: `USING (auth.uid() = user_id)`
- INSERT: `WITH CHECK (auth.uid() = user_id)`
- UPDATE: `USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)`
- DELETE: `USING (auth.uid() = user_id)`

---

## 4. Authentication

### 4.1 Routes
| Route | Purpose |
|---|---|
| `/` | Splash — "Get Started" → `/signup`, "I already have an account" → `/login` |
| `/signup` | New: email, password, confirm password → on success → `/add-child` |
| `/login` | New: email, password, forgot password link → on success → `/home` |

### 4.2 Auth Guard
- All routes except `/`, `/signup`, `/login` require an authenticated session
- Unauthenticated users are redirected to `/`
- Session managed by Supabase built-in session management via `onAuthStateChange`

### 4.3 Settings Auth
- Log Out calls `supabase.auth.signOut()` → redirect to `/`
- Account section shows the real logged-in user's email

---

## 5. Feature Phases

### Phase 1 — Supabase Schema
Apply migrations for all 6 tables + Storage bucket `child-photos`.

### Phase 2 — Auth Screens
Build `/login` and `/signup` with validation and error handling.
Wire auth guard using React context + `onAuthStateChange`.

### Phase 3 — Supabase Client + Home + AddChild
- Create `src/lib/supabase.js`
- Delete `src/data/mockData.js`
- Wire Home to fetch children + latest size + latest activity per child
- Wire AddChild to INSERT children, handle photo upload to Storage

### Phase 4 — ChildProfile Data + Edit
- Fetch child + all related records
- Edit Profile modal (name, birthdate, birth_time, birth_location, photo)
- Delete child with confirmation

### Phase 5 — Quick Action Modals
Four modals off the Overview tab quick action buttons:
- Add Size → INSERT size_history
- Log Activity → INSERT activities
- Add Account → INSERT child_accounts
- Add Note → INSERT child_notes

### Phase 6 — Activities Tab
List activities in reverse-chron order, category badge, expandable rows, delete.

### Phase 7 — Notes + Accounts in Overview
Count rows + expandable list views in Overview tab At A Glance section.

### Phase 8 — Weekly Insights
`src/data/insightThemes.js`: 12 signs × 4 rotating weekly themes (48 combos).
Insights page derives sign from birthdate + week-of-year to pick theme.

### Phase 9 — Dynamic Needs Attention
Derive flags from real data: size > 180 days old, no activity in 30 days.

### Phase 10 — Settings Persistence
- Dark mode: CSS class on root + localStorage
- Reminders toggle: profiles.weekly_reminders (Supabase)
- Frequency: profiles.reminder_frequency (Supabase)

### Phase 11 — CSV Export
Fetch all user data, generate 3 CSV files, download via Blob + anchor.

---

## 6. UX Requirements

- Mobile-first, max-w-sm centered layout — never change this
- Keep all existing Tailwind classes, colors, and fonts exactly as-is
- All modals use cream/white palette — no browser dialogs
- Loading states throughout (spinner or skeleton)
- Empty states with actionable prompts (e.g. "No activities yet" + Log Activity button)
- Inline validation errors in `text-atlas-muted`
- All form inputs follow existing `bg-cream-100 rounded-xl border border-cream-300` style

---

## 7. Files To Create

```
src/lib/supabase.js
src/store/authStore.jsx
src/data/insightThemes.js
src/pages/Login.jsx
src/pages/Signup.jsx
src/pages/EditChild.jsx
src/components/Modal.jsx
src/components/Spinner.jsx
src/components/modals/AddSizeModal.jsx
src/components/modals/AddActivityModal.jsx
src/components/modals/AddAccountModal.jsx
src/components/modals/AddNoteModal.jsx
```

## 8. Files To Modify

```
src/App.jsx              — add /login, /signup, /child/:id/edit routes; auth guard
src/pages/Splash.jsx     — update button routes
src/pages/Home.jsx       — real data fetch
src/pages/AddChild.jsx   — real insert + photo upload
src/pages/ChildProfile.jsx — real data fetch; tabs state
src/pages/Insights.jsx   — insightThemes lookup
src/pages/Settings.jsx   — real logout, real email, preference persistence
src/pages/tabs/OverviewTab.jsx — modals, Notes/Accounts rows, dynamic Needs Attention
src/pages/tabs/PhysicalTab.jsx — real data, save to Supabase
```

## 9. Files To Delete

```
src/data/mockData.js
```
