
-- Enable Row Level Security and define strong RLS policies for all main tables

-- 1. CALLS TABLE
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own calls" ON public.calls;
DROP POLICY IF EXISTS "Users can insert their own calls" ON public.calls;
DROP POLICY IF EXISTS "Users can update their own calls" ON public.calls;
DROP POLICY IF EXISTS "Users can delete their own calls" ON public.calls;

CREATE POLICY "Users can view their own calls"
  ON public.calls FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calls"
  ON public.calls FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calls"
  ON public.calls FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calls"
  ON public.calls FOR DELETE
  USING (auth.uid() = user_id);

-- 2. OPPORTUNITIES TABLE
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can insert their own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can update their own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can delete their own opportunities" ON public.opportunities;

CREATE POLICY "Users can view their own opportunities"
  ON public.opportunities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own opportunities"
  ON public.opportunities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own opportunities"
  ON public.opportunities FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own opportunities"
  ON public.opportunities FOR DELETE
  USING (auth.uid() = user_id);

-- 3. SALESPEOPLE TABLE
ALTER TABLE public.salespeople ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own salespeople" ON public.salespeople;
DROP POLICY IF EXISTS "Users can insert their own salespeople" ON public.salespeople;
DROP POLICY IF EXISTS "Users can update their own salespeople" ON public.salespeople;
DROP POLICY IF EXISTS "Users can delete their own salespeople" ON public.salespeople;

CREATE POLICY "Users can view their own salespeople"
  ON public.salespeople FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own salespeople"
  ON public.salespeople FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own salespeople"
  ON public.salespeople FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own salespeople"
  ON public.salespeople FOR DELETE
  USING (auth.uid() = user_id);

-- 4. OPPORTUNITY_CONTACTS TABLE
ALTER TABLE public.opportunity_contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own opportunity contacts" ON public.opportunity_contacts;
DROP POLICY IF EXISTS "Users can create their own opportunity contacts" ON public.opportunity_contacts;
DROP POLICY IF EXISTS "Users can update their own opportunity contacts" ON public.opportunity_contacts;
DROP POLICY IF EXISTS "Users can delete their own opportunity contacts" ON public.opportunity_contacts;

CREATE POLICY "Users can view their own opportunity contacts"
  ON public.opportunity_contacts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own opportunity contacts"
  ON public.opportunity_contacts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own opportunity contacts"
  ON public.opportunity_contacts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own opportunity contacts"
  ON public.opportunity_contacts FOR DELETE
  USING (auth.uid() = user_id);

-- 5. OPPORTUNITY_FILES TABLE
ALTER TABLE public.opportunity_files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own opportunity files" ON public.opportunity_files;
DROP POLICY IF EXISTS "Users can create their own opportunity files" ON public.opportunity_files;
DROP POLICY IF EXISTS "Users can update their own opportunity files" ON public.opportunity_files;
DROP POLICY IF EXISTS "Users can delete their own opportunity files" ON public.opportunity_files;
DROP POLICY IF EXISTS "Users can view files for their own opportunities" ON public.opportunity_files;

-- Allow users to see files for any opportunity they own, not just their own file uploads
CREATE POLICY "Users can view files for their own opportunities"
  ON public.opportunity_files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.opportunities o
      WHERE o.id = opportunity_files.opportunity_id AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own opportunity files"
  ON public.opportunity_files FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own opportunity files"
  ON public.opportunity_files FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own opportunity files"
  ON public.opportunity_files FOR DELETE
  USING (auth.uid() = user_id);

-- 6. OPPORTUNITY_NOTES TABLE
ALTER TABLE public.opportunity_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own opportunity notes" ON public.opportunity_notes;
DROP POLICY IF EXISTS "Users can create their own opportunity notes" ON public.opportunity_notes;
DROP POLICY IF EXISTS "Users can update their own opportunity notes" ON public.opportunity_notes;
DROP POLICY IF EXISTS "Users can delete their own opportunity notes" ON public.opportunity_notes;
DROP POLICY IF EXISTS "Users can view notes for their own opportunities" ON public.opportunity_notes;

-- Allow users to see notes for opportunities they own, even if they did not write the note
CREATE POLICY "Users can view notes for their own opportunities"
  ON public.opportunity_notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.opportunities o
      WHERE o.id = opportunity_notes.opportunity_id AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own opportunity notes"
  ON public.opportunity_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own opportunity notes"
  ON public.opportunity_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own opportunity notes"
  ON public.opportunity_notes FOR DELETE
  USING (auth.uid() = user_id);

-- 7. PROFILES TABLE
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
