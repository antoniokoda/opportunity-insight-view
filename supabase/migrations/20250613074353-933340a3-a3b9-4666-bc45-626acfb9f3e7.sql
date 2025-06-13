
-- Create salespeople table
CREATE TABLE public.salespeople (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create opportunities table  
CREATE TABLE public.opportunities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  salesperson_id INTEGER REFERENCES public.salespeople(id) ON DELETE CASCADE NOT NULL,
  lead_source TEXT NOT NULL,
  opportunity_status TEXT NOT NULL DEFAULT 'active' CHECK (opportunity_status IN ('active', 'won', 'lost')),
  proposal_status TEXT NOT NULL DEFAULT 'created' CHECK (proposal_status IN ('created', 'pitched')),
  revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
  cash_collected DECIMAL(10,2) NOT NULL DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create calls table
CREATE TABLE public.calls (
  id SERIAL PRIMARY KEY,
  opportunity_id INTEGER REFERENCES public.opportunities(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Discovery', 'Closing')),
  number INTEGER NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.salespeople ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for salespeople
CREATE POLICY "Users can view their own salespeople" ON public.salespeople
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own salespeople" ON public.salespeople
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own salespeople" ON public.salespeople
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own salespeople" ON public.salespeople
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for opportunities
CREATE POLICY "Users can view their own opportunities" ON public.opportunities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own opportunities" ON public.opportunities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own opportunities" ON public.opportunities
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own opportunities" ON public.opportunities
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for calls
CREATE POLICY "Users can view their own calls" ON public.calls
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calls" ON public.calls
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calls" ON public.calls
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calls" ON public.calls
  FOR DELETE USING (auth.uid() = user_id);
