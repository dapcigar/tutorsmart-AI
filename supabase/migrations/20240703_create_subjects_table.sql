-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    level TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Subjects are viewable by all authenticated users" ON subjects;
CREATE POLICY "Subjects are viewable by all authenticated users"
    ON subjects FOR SELECT
    USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Subjects are insertable by admins" ON subjects;
CREATE POLICY "Subjects are insertable by admins"
    ON subjects FOR INSERT
    WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Subjects are updatable by admins" ON subjects;
CREATE POLICY "Subjects are updatable by admins"
    ON subjects FOR UPDATE
    USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE subjects;
