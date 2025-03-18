-- Create tutor availability table for recurring slots
CREATE TABLE IF NOT EXISTS tutor_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID NOT NULL REFERENCES users(id),
  day TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_recurring BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

-- Create table for availability exceptions (specific dates)
CREATE TABLE IF NOT EXISTS tutor_availability_exceptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID NOT NULL REFERENCES users(id),
  exception_date DATE NOT NULL,
  is_available BOOLEAN DEFAULT false,
  start_time TIME,
  end_time TIME,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_exception_time_range CHECK (start_time IS NULL OR end_time IS NULL OR start_time < end_time)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_tutor_availability_tutor_id ON tutor_availability(tutor_id);
CREATE INDEX IF NOT EXISTS idx_tutor_availability_day ON tutor_availability(day);
CREATE INDEX IF NOT EXISTS idx_tutor_availability_exceptions_tutor_id ON tutor_availability_exceptions(tutor_id);
CREATE INDEX IF NOT EXISTS idx_tutor_availability_exceptions_date ON tutor_availability_exceptions(exception_date);

-- Enable realtime for these tables
alter publication supabase_realtime add table tutor_availability;
alter publication supabase_realtime add table tutor_availability_exceptions;
