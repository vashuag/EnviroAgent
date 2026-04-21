-- EnviroAgent Goals Schema (run in Supabase SQL editor)
-- Extends the existing User table

-- Goals / Commitments
CREATE TABLE IF NOT EXISTS "Goal" (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId"      TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  emoji         TEXT DEFAULT '🌱',
  category      TEXT DEFAULT 'general',
  "startDate"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "endDate"     TIMESTAMPTZ NOT NULL,
  "totalDays"   INTEGER NOT NULL,
  progress      INTEGER NOT NULL DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'active',  -- active | paused | completed
  color         TEXT DEFAULT '#3ecfc6',
  "lastActivity" TEXT,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Agents (one per goal)
CREATE TABLE IF NOT EXISTS "Agent" (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "goalId"        TEXT NOT NULL REFERENCES "Goal"(id) ON DELETE CASCADE,
  "userId"        TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  avatar          TEXT DEFAULT '🤖',
  personality     TEXT,
  status          TEXT NOT NULL DEFAULT 'idle',   -- active | idle | working
  "actionsToday"  INTEGER NOT NULL DEFAULT 0,
  "totalActions"  INTEGER NOT NULL DEFAULT 0,
  "lastAction"    TEXT,
  "lastActionTime" TIMESTAMPTZ,
  "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tool connections per user
CREATE TABLE IF NOT EXISTS "ToolConnection" (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId"    TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "toolId"    TEXT NOT NULL,         -- e.g. 't1', 'calendar', 'spotify'
  "toolName"  TEXT NOT NULL,
  connected   BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE("userId", "toolId")
);

-- Goal ↔ Tool join (which tools are active for a goal)
CREATE TABLE IF NOT EXISTS "GoalTool" (
  "goalId"  TEXT NOT NULL REFERENCES "Goal"(id) ON DELETE CASCADE,
  "toolId"  TEXT NOT NULL,
  PRIMARY KEY ("goalId", "toolId")
);

-- Activity log
CREATE TABLE IF NOT EXISTS "ActivityLog" (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId"      TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "agentId"     TEXT REFERENCES "Agent"(id) ON DELETE SET NULL,
  "goalId"      TEXT REFERENCES "Goal"(id) ON DELETE SET NULL,
  "agentName"   TEXT,
  "goalTitle"   TEXT,
  action        TEXT NOT NULL,
  type          TEXT NOT NULL,   -- scheduled | drafted | blocked | nudged | logged | updated
  details       TEXT,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row-level security (enable after setup)
ALTER TABLE "Goal"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Agent"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ToolConnection" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GoalTool"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ActivityLog"   ENABLE ROW LEVEL SECURITY;

-- Policies: users can only access their own rows
CREATE POLICY "own goals"    ON "Goal"           FOR ALL USING ("userId" = auth.uid()::text);
CREATE POLICY "own agents"   ON "Agent"          FOR ALL USING ("userId" = auth.uid()::text);
CREATE POLICY "own tools"    ON "ToolConnection" FOR ALL USING ("userId" = auth.uid()::text);
CREATE POLICY "own activity" ON "ActivityLog"    FOR ALL USING ("userId" = auth.uid()::text);
-- GoalTool: allow if user owns the goal
CREATE POLICY "own goaltools" ON "GoalTool" FOR ALL
  USING (EXISTS (SELECT 1 FROM "Goal" g WHERE g.id = "GoalTool"."goalId" AND g."userId" = auth.uid()::text));
