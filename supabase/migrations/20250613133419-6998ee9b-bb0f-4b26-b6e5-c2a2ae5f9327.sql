
-- Create lead_sources table
CREATE TABLE public.lead_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.lead_sources ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for lead_sources
CREATE POLICY "Users can view their own lead sources" ON public.lead_sources
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lead sources" ON public.lead_sources
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lead sources" ON public.lead_sources
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lead sources" ON public.lead_sources
  FOR DELETE USING (auth.uid() = user_id);
