
-- Re-enable RLS on all tables that should have user isolation
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salespeople ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_notes ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Users can view their own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can create their own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can update their own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can delete their own opportunities" ON public.opportunities;

DROP POLICY IF EXISTS "Users can view their own salespeople" ON public.salespeople;
DROP POLICY IF EXISTS "Users can create their own salespeople" ON public.salespeople;
DROP POLICY IF EXISTS "Users can update their own salespeople" ON public.salespeople;
DROP POLICY IF EXISTS "Users can delete their own salespeople" ON public.salespeople;

DROP POLICY IF EXISTS "Users can view their own lead sources" ON public.lead_sources;
DROP POLICY IF EXISTS "Users can create their own lead sources" ON public.lead_sources;
DROP POLICY IF EXISTS "Users can update their own lead sources" ON public.lead_sources;
DROP POLICY IF EXISTS "Users can delete their own lead sources" ON public.lead_sources;

DROP POLICY IF EXISTS "Users can view their own calls" ON public.calls;
DROP POLICY IF EXISTS "Users can create their own calls" ON public.calls;
DROP POLICY IF EXISTS "Users can update their own calls" ON public.calls;
DROP POLICY IF EXISTS "Users can delete their own calls" ON public.calls;

DROP POLICY IF EXISTS "Users can view their own opportunity contacts" ON public.opportunity_contacts;
DROP POLICY IF EXISTS "Users can create their own opportunity contacts" ON public.opportunity_contacts;
DROP POLICY IF EXISTS "Users can update their own opportunity contacts" ON public.opportunity_contacts;
DROP POLICY IF EXISTS "Users can delete their own opportunity contacts" ON public.opportunity_contacts;

DROP POLICY IF EXISTS "Users can view their own opportunity files" ON public.opportunity_files;
DROP POLICY IF EXISTS "Users can create their own opportunity files" ON public.opportunity_files;
DROP POLICY IF EXISTS "Users can update their own opportunity files" ON public.opportunity_files;
DROP POLICY IF EXISTS "Users can delete their own opportunity files" ON public.opportunity_files;

DROP POLICY IF EXISTS "Users can view their own opportunity notes" ON public.opportunity_notes;
DROP POLICY IF EXISTS "Users can create their own opportunity notes" ON public.opportunity_notes;
DROP POLICY IF EXISTS "Users can update their own opportunity notes" ON public.opportunity_notes;
DROP POLICY IF EXISTS "Users can delete their own opportunity notes" ON public.opportunity_notes;

-- Create proper RLS policies for opportunities table
CREATE POLICY "Users can view their own opportunities"
ON public.opportunities FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own opportunities"
ON public.opportunities FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own opportunities"
ON public.opportunities FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own opportunities"
ON public.opportunities FOR DELETE
USING (auth.uid() = user_id);

-- Create proper RLS policies for salespeople table
CREATE POLICY "Users can view their own salespeople"
ON public.salespeople FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own salespeople"
ON public.salespeople FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own salespeople"
ON public.salespeople FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own salespeople"
ON public.salespeople FOR DELETE
USING (auth.uid() = user_id);

-- Create proper RLS policies for lead_sources table
CREATE POLICY "Users can view their own lead sources"
ON public.lead_sources FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lead sources"
ON public.lead_sources FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lead sources"
ON public.lead_sources FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lead sources"
ON public.lead_sources FOR DELETE
USING (auth.uid() = user_id);

-- Create proper RLS policies for calls table
CREATE POLICY "Users can view their own calls"
ON public.calls FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own calls"
ON public.calls FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calls"
ON public.calls FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calls"
ON public.calls FOR DELETE
USING (auth.uid() = user_id);

-- Create proper RLS policies for opportunity_contacts table
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

-- Create proper RLS policies for opportunity_files table
CREATE POLICY "Users can view their own opportunity files"
ON public.opportunity_files FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own opportunity files"
ON public.opportunity_files FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own opportunity files"
ON public.opportunity_files FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own opportunity files"
ON public.opportunity_files FOR DELETE
USING (auth.uid() = user_id);

-- Create proper RLS policies for opportunity_notes table
CREATE POLICY "Users can view their own opportunity notes"
ON public.opportunity_notes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own opportunity notes"
ON public.opportunity_notes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own opportunity notes"
ON public.opportunity_notes FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own opportunity notes"
ON public.opportunity_notes FOR DELETE
USING (auth.uid() = user_id);
