-- Create tutor_subjects table with proper foreign key relationship
CREATE TABLE IF NOT EXISTS public.tutor_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id),
    subject_id UUID NOT NULL,
    proficiency_level VARCHAR(20) NOT NULL DEFAULT 'intermediate',
    is_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE public.tutor_subjects ENABLE ROW LEVEL SECURITY;

-- Create policy for tutors to view their own subjects
DROP POLICY IF EXISTS "Tutors can view their own subjects" ON public.tutor_subjects;
CREATE POLICY "Tutors can view their own subjects"
    ON public.tutor_subjects
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Create policy for admins to manage all tutor subjects
DROP POLICY IF EXISTS "Admins can manage all tutor subjects" ON public.tutor_subjects;
CREATE POLICY "Admins can manage all tutor subjects"
    ON public.tutor_subjects
    FOR ALL
    TO authenticated
    USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- Enable realtime
alter publication supabase_realtime add table tutor_subjects;