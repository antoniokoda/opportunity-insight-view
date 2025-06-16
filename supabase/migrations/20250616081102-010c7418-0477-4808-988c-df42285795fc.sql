
-- Remove Row Level Security from all tables to allow shared data access
-- This will make all data visible to all authenticated users

-- 1. Disable RLS on opportunities table
ALTER TABLE public.opportunities DISABLE ROW LEVEL SECURITY;

-- Drop all existing RLS policies for opportunities
DROP POLICY IF EXISTS "Users can view their own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can insert their own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can create their own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can update their own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can delete their own opportunities" ON public.opportunities;

-- 2. Disable RLS on calls table
ALTER TABLE public.calls DISABLE ROW LEVEL SECURITY;

-- Drop all existing RLS policies for calls
DROP POLICY IF EXISTS "Users can view their own calls" ON public.calls;
DROP POLICY IF EXISTS "Users can insert their own calls" ON public.calls;
DROP POLICY IF EXISTS "Users can create their own calls" ON public.calls;
DROP POLICY IF EXISTS "Users can update their own calls" ON public.calls;
DROP POLICY IF EXISTS "Users can delete their own calls" ON public.calls;

-- 3. Disable RLS on salespeople table
ALTER TABLE public.salespeople DISABLE ROW LEVEL SECURITY;

-- Drop all existing RLS policies for salespeople
DROP POLICY IF EXISTS "Users can view their own salespeople" ON public.salespeople;
DROP POLICY IF EXISTS "Users can insert their own salespeople" ON public.salespeople;
DROP POLICY IF EXISTS "Users can create their own salespeople" ON public.salespeople;
DROP POLICY IF EXISTS "Users can update their own salespeople" ON public.salespeople;
DROP POLICY IF EXISTS "Users can delete their own salespeople" ON public.salespeople;

-- 4. Disable RLS on lead_sources table
ALTER TABLE public.lead_sources DISABLE ROW LEVEL SECURITY;

-- Drop all existing RLS policies for lead_sources
DROP POLICY IF EXISTS "Users can view their own lead sources" ON public.lead_sources;
DROP POLICY IF EXISTS "Users can insert their own lead sources" ON public.lead_sources;
DROP POLICY IF EXISTS "Users can create their own lead sources" ON public.lead_sources;
DROP POLICY IF EXISTS "Users can update their own lead sources" ON public.lead_sources;
DROP POLICY IF EXISTS "Users can delete their own lead sources" ON public.lead_sources;

-- 5. Disable RLS on opportunity_contacts table
ALTER TABLE public.opportunity_contacts DISABLE ROW LEVEL SECURITY;

-- Drop all existing RLS policies for opportunity_contacts
DROP POLICY IF EXISTS "Users can view their own opportunity contacts" ON public.opportunity_contacts;
DROP POLICY IF EXISTS "Users can create their own opportunity contacts" ON public.opportunity_contacts;
DROP POLICY IF EXISTS "Users can update their own opportunity contacts" ON public.opportunity_contacts;
DROP POLICY IF EXISTS "Users can delete their own opportunity contacts" ON public.opportunity_contacts;
DROP POLICY IF EXISTS "Users can view contacts for their own opportunities" ON public.opportunity_contacts;

-- 6. Disable RLS on opportunity_files table
ALTER TABLE public.opportunity_files DISABLE ROW LEVEL SECURITY;

-- Drop all existing RLS policies for opportunity_files
DROP POLICY IF EXISTS "Users can view their own opportunity files" ON public.opportunity_files;
DROP POLICY IF EXISTS "Users can create their own opportunity files" ON public.opportunity_files;
DROP POLICY IF EXISTS "Users can update their own opportunity files" ON public.opportunity_files;
DROP POLICY IF EXISTS "Users can delete their own opportunity files" ON public.opportunity_files;
DROP POLICY IF EXISTS "Users can view files for their own opportunities" ON public.opportunity_files;

-- 7. Disable RLS on opportunity_notes table
ALTER TABLE public.opportunity_notes DISABLE ROW LEVEL SECURITY;

-- Drop all existing RLS policies for opportunity_notes
DROP POLICY IF EXISTS "Users can view their own opportunity notes" ON public.opportunity_notes;
DROP POLICY IF EXISTS "Users can create their own opportunity notes" ON public.opportunity_notes;
DROP POLICY IF EXISTS "Users can update their own opportunity notes" ON public.opportunity_notes;
DROP POLICY IF EXISTS "Users can delete their own opportunity notes" ON public.opportunity_notes;
DROP POLICY IF EXISTS "Users can view notes for their own opportunities" ON public.opportunity_notes;

-- Note: We keep profiles table RLS as users should still only manage their own profile
-- The profiles table RLS policies remain unchanged
