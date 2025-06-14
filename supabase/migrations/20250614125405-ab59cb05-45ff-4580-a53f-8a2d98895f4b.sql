
-- 1. Enable RLS and define policies for the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, to prevent errors
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Policy: Authenticated users can view all profiles
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 2. Update RLS for opportunity_notes to allow viewing all notes for an owned opportunity
DROP POLICY IF EXISTS "Users can view their own opportunity notes" ON public.opportunity_notes;
DROP POLICY IF EXISTS "Users can view notes for their own opportunities" ON public.opportunity_notes;

CREATE POLICY "Users can view notes for their own opportunities"
ON public.opportunity_notes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.opportunities o
    WHERE o.id = opportunity_notes.opportunity_id AND o.user_id = auth.uid()
  )
);

-- 3. Update RLS for opportunity_files to allow viewing all files for an owned opportunity
DROP POLICY IF EXISTS "Users can view their own opportunity files" ON public.opportunity_files;
DROP POLICY IF EXISTS "Users can view files for their own opportunities" ON public.opportunity_files;

CREATE POLICY "Users can view files for their own opportunities"
ON public.opportunity_files FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.opportunities o
    WHERE o.id = opportunity_files.opportunity_id AND o.user_id = auth.uid()
  )
);
