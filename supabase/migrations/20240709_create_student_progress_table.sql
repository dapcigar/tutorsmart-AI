-- Create student progress table
CREATE TABLE IF NOT EXISTS student_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL,
  score NUMERIC NOT NULL,
  max_score NUMERIC NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create student achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  criteria JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  total INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, achievement_id)
);

-- Enable RLS
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Students can view their own progress"
  ON student_progress FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Tutors can view their students' progress"
  ON student_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.tutor_id = auth.uid()
      AND sessions.student_id = student_progress.student_id
    )
  );

CREATE POLICY "Admins can view all progress"
  ON student_progress FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Tutors can add progress records"
  ON student_progress FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' = 'tutor' AND
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.tutor_id = auth.uid()
      AND sessions.student_id = student_progress.student_id
    )
  );

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE student_progress;
ALTER PUBLICATION supabase_realtime ADD TABLE student_achievements;
