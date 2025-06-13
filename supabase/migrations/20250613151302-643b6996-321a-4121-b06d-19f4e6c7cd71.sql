
-- Disable RLS and drop all policies for salespeople table
ALTER TABLE public.salespeople DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own salespeople" ON public.salespeople;
DROP POLICY IF EXISTS "Users can insert their own salespeople" ON public.salespeople;
DROP POLICY IF EXISTS "Users can update their own salespeople" ON public.salespeople;
DROP POLICY IF EXISTS "Users can delete their own salespeople" ON public.salespeople;

-- Disable RLS and drop all policies for lead_sources table
ALTER TABLE public.lead_sources DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own lead sources" ON public.lead_sources;
DROP POLICY IF EXISTS "Users can insert their own lead sources" ON public.lead_sources;
DROP POLICY IF EXISTS "Users can update their own lead sources" ON public.lead_sources;
DROP POLICY IF EXISTS "Users can delete their own lead sources" ON public.lead_sources;

-- Also disable RLS for opportunities and calls tables to ensure everything works smoothly
ALTER TABLE public.opportunities DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can insert their own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can update their own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can delete their own opportunities" ON public.opportunities;

ALTER TABLE public.calls DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own calls" ON public.calls;
DROP POLICY IF EXISTS "Users can insert their own calls" ON public.calls;
DROP POLICY IF EXISTS "Users can update their own calls" ON public.calls;
DROP POLICY IF EXISTS "Users can delete their own calls" ON public.calls;
