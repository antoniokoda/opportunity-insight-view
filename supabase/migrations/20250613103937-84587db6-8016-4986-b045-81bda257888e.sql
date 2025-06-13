
-- Create a table for opportunity contacts
CREATE TABLE public.opportunity_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id INTEGER NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  position TEXT,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own contacts
ALTER TABLE public.opportunity_contacts ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own contacts
CREATE POLICY "Users can view their own opportunity contacts" 
  ON public.opportunity_contacts 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own contacts
CREATE POLICY "Users can create their own opportunity contacts" 
  ON public.opportunity_contacts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own contacts
CREATE POLICY "Users can update their own opportunity contacts" 
  ON public.opportunity_contacts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own contacts
CREATE POLICY "Users can delete their own opportunity contacts" 
  ON public.opportunity_contacts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add email validation constraint (optional field but if provided should be valid)
ALTER TABLE public.opportunity_contacts 
ADD CONSTRAINT valid_email 
CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add LinkedIn URL validation constraint (optional field but if provided should be valid)
ALTER TABLE public.opportunity_contacts 
ADD CONSTRAINT valid_linkedin_url 
CHECK (linkedin_url IS NULL OR linkedin_url ~* '^https?://.*linkedin\.com/.*$');

-- Create index for better performance when querying contacts by opportunity
CREATE INDEX idx_opportunity_contacts_opportunity_id ON public.opportunity_contacts(opportunity_id);
