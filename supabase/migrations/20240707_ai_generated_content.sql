-- Create table for AI-generated teaching plans
CREATE TABLE IF NOT EXISTS teaching_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subject_id UUID NOT NULL REFERENCES subjects(id),
  content TEXT NOT NULL,
  student_level TEXT, -- 'beginner', 'intermediate', 'advanced'
  created_by UUID NOT NULL REFERENCES users(id),
  ai_generated BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for AI-generated quizzes
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subject_id UUID NOT NULL REFERENCES subjects(id),
  questions JSONB NOT NULL, -- JSON array of question objects
  created_by UUID NOT NULL REFERENCES users(id),
  ai_generated BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for student quiz attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id),
  student_id UUID NOT NULL REFERENCES users(id),
  answers JSONB NOT NULL, -- JSON with student answers
  score INTEGER,
  max_score INTEGER,
  completed BOOLEAN DEFAULT false,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for AI learning recommendations
CREATE TABLE IF NOT EXISTS learning_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id),
  subject_id UUID NOT NULL REFERENCES subjects(id),
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL, -- 'video', 'article', 'practice', 'book', etc.
  resource_url TEXT,
  viewed BOOLEAN DEFAULT false,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_teaching_plans_subject_id ON teaching_plans(subject_id);
CREATE INDEX IF NOT EXISTS idx_teaching_plans_created_by ON teaching_plans(created_by);
CREATE INDEX IF NOT EXISTS idx_quizzes_subject_id ON quizzes(subject_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_created_by ON quizzes(created_by);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student_id ON quiz_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_learning_recommendations_student_id ON learning_recommendations(student_id);
CREATE INDEX IF NOT EXISTS idx_learning_recommendations_subject_id ON learning_recommendations(subject_id);

-- Enable realtime for these tables
alter publication supabase_realtime add table teaching_plans;
alter publication supabase_realtime add table quizzes;
alter publication supabase_realtime add table quiz_attempts;
alter publication supabase_realtime add table learning_recommendations;
