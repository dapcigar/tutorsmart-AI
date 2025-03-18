-- Create parent_child_relationships table
CREATE TABLE IF NOT EXISTS parent_child_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(parent_id, child_id)
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS parent_child_parent_id_idx ON parent_child_relationships(parent_id);
CREATE INDEX IF NOT EXISTS parent_child_child_id_idx ON parent_child_relationships(child_id);

-- Enable row level security
ALTER TABLE parent_child_relationships ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Parents can view their own children" ON parent_child_relationships;
CREATE POLICY "Parents can view their own children"
  ON parent_child_relationships
  FOR SELECT
  USING (auth.uid() = parent_id);

DROP POLICY IF EXISTS "Parents can add their own children" ON parent_child_relationships;
CREATE POLICY "Parents can add their own children"
  ON parent_child_relationships
  FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

DROP POLICY IF EXISTS "Parents can remove their own children" ON parent_child_relationships;
CREATE POLICY "Parents can remove their own children"
  ON parent_child_relationships
  FOR DELETE
  USING (auth.uid() = parent_id);

-- Add to realtime publication
alter publication supabase_realtime add table parent_child_relationships;
