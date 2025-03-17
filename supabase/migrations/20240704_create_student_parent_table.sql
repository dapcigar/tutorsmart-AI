-- Create student_parent relationship table
CREATE TABLE IF NOT EXISTS student_parent (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    relationship TEXT,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, parent_id)
);

-- Add RLS policies
ALTER TABLE student_parent ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Student-parent relationships are viewable by involved users and admins" ON student_parent;
CREATE POLICY "Student-parent relationships are viewable by involved users and admins"
    ON student_parent FOR SELECT
    USING (
        auth.uid() = student_id OR 
        auth.uid() = parent_id OR 
        (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
    );

DROP POLICY IF EXISTS "Student-parent relationships are insertable by admins" ON student_parent;
CREATE POLICY "Student-parent relationships are insertable by admins"
    ON student_parent FOR INSERT
    WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Student-parent relationships are updatable by admins" ON student_parent;
CREATE POLICY "Student-parent relationships are updatable by admins"
    ON student_parent FOR UPDATE
    USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE student_parent;
