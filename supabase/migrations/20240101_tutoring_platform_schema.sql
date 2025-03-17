-- Create users table extension
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('student', 'tutor', 'parent', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for profiles
DROP POLICY IF EXISTS "Users can view their own profile";
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile";
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create students table
CREATE TABLE IF NOT EXISTS public.students (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  grade TEXT,
  parent_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Create tutors table
CREATE TABLE IF NOT EXISTS public.tutors (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  bio TEXT,
  hourly_rate DECIMAL(10, 2),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security
ALTER TABLE public.tutors ENABLE ROW LEVEL SECURITY;

-- Create parents table
CREATE TABLE IF NOT EXISTS public.parents (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;

-- Create subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create tutor_subjects table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.tutor_subjects (
  tutor_id UUID REFERENCES public.tutors(id),
  subject_id UUID REFERENCES public.subjects(id),
  PRIMARY KEY (tutor_id, subject_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID REFERENCES public.tutors(id) NOT NULL,
  student_id UUID REFERENCES public.students(id) NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Create tutor_availability table
CREATE TABLE IF NOT EXISTS public.tutor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID REFERENCES public.tutors(id) NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create assignments table
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  subject_id UUID REFERENCES public.subjects(id) NOT NULL,
  tutor_id UUID REFERENCES public.tutors(id) NOT NULL,
  student_id UUID REFERENCES public.students(id) NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed', 'overdue')) DEFAULT 'not_started',
  is_ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Create teaching_plans table
CREATE TABLE IF NOT EXISTS public.teaching_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  subject_id UUID REFERENCES public.subjects(id) NOT NULL,
  tutor_id UUID REFERENCES public.tutors(id) NOT NULL,
  is_ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security
ALTER TABLE public.teaching_plans ENABLE ROW LEVEL SECURITY;

-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create student_achievements table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.student_achievements (
  student_id UUID REFERENCES public.students(id),
  achievement_id UUID REFERENCES public.achievements(id),
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (student_id, achievement_id)
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES public.parents(id) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  recipient_id UUID REFERENCES auth.users(id) NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Enable realtime for all tables
alter publication supabase_realtime add table profiles;
alter publication supabase_realtime add table students;
alter publication supabase_realtime add table tutors;
alter publication supabase_realtime add table parents;
alter publication supabase_realtime add table subjects;
alter publication supabase_realtime add table tutor_subjects;
alter publication supabase_realtime add table sessions;
alter publication supabase_realtime add table tutor_availability;
alter publication supabase_realtime add table assignments;
alter publication supabase_realtime add table teaching_plans;
alter publication supabase_realtime add table achievements;
alter publication supabase_realtime add table student_achievements;
alter publication supabase_realtime add table payments;
alter publication supabase_realtime add table messages;
