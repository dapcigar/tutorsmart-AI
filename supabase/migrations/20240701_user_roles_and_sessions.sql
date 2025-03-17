-- Add role column to users table if it doesn't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'student';

-- Create sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.users(id),
    tutor_id UUID NOT NULL REFERENCES public.users(id),
    subject VARCHAR(100) NOT NULL,
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration INTEGER NOT NULL DEFAULT 60,
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security on sessions
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for students to view their own sessions
DROP POLICY IF EXISTS "Students can view their own sessions" ON public.sessions;
CREATE POLICY "Students can view their own sessions"
    ON public.sessions
    FOR SELECT
    TO authenticated
    USING (student_id = auth.uid());

-- Create policy for tutors to view sessions they are teaching
DROP POLICY IF EXISTS "Tutors can view sessions they are teaching" ON public.sessions;
CREATE POLICY "Tutors can view sessions they are teaching"
    ON public.sessions
    FOR SELECT
    TO authenticated
    USING (tutor_id = auth.uid());

-- Create policy for students to create sessions
DROP POLICY IF EXISTS "Students can create sessions" ON public.sessions;
CREATE POLICY "Students can create sessions"
    ON public.sessions
    FOR INSERT
    TO authenticated
    WITH CHECK (student_id = auth.uid());

-- Create policy for tutors to update sessions they are teaching
DROP POLICY IF EXISTS "Tutors can update sessions they are teaching" ON public.sessions;
CREATE POLICY "Tutors can update sessions they are teaching"
    ON public.sessions
    FOR UPDATE
    TO authenticated
    USING (tutor_id = auth.uid());
