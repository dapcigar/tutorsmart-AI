-- Create parent_child_relationships table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.parent_child_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(parent_id, child_id)
);

-- Set up RLS policies
ALTER TABLE public.parent_child_relationships ENABLE ROW LEVEL SECURITY;

-- Policy to allow parents to see their own children
DROP POLICY IF EXISTS "Parents can see their own children" ON public.parent_child_relationships;
CREATE POLICY "Parents can see their own children"
  ON public.parent_child_relationships
  FOR SELECT
  USING (auth.uid() = parent_id);

-- Policy to allow parents to add children
DROP POLICY IF EXISTS "Parents can add children" ON public.parent_child_relationships;
CREATE POLICY "Parents can add children"
  ON public.parent_child_relationships
  FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

-- Policy to allow parents to remove their own children
DROP POLICY IF EXISTS "Parents can remove their own children" ON public.parent_child_relationships;
CREATE POLICY "Parents can remove their own children"
  ON public.parent_child_relationships
  FOR DELETE
  USING (auth.uid() = parent_id);

-- Add to realtime publication (only if not already added)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'parent_child_relationships'
  ) THEN
    alter publication supabase_realtime add table parent_child_relationships;
  END IF;
END
$$;