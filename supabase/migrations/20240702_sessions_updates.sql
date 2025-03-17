-- This migration adds any additional changes to the sessions table without trying to add it to realtime publication again

-- Add indexes to improve query performance
CREATE INDEX IF NOT EXISTS sessions_student_id_idx ON public.sessions(student_id);
CREATE INDEX IF NOT EXISTS sessions_tutor_id_idx ON public.sessions(tutor_id);
CREATE INDEX IF NOT EXISTS sessions_date_idx ON public.sessions(session_date);

-- Add trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_sessions_updated_at ON public.sessions;
CREATE TRIGGER set_sessions_updated_at
BEFORE UPDATE ON public.sessions
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Add policy for students to update their own sessions (e.g., cancel)
DROP POLICY IF EXISTS "Students can update their own sessions" ON public.sessions;
CREATE POLICY "Students can update their own sessions"
    ON public.sessions
    FOR UPDATE
    TO authenticated
    USING (student_id = auth.uid());
