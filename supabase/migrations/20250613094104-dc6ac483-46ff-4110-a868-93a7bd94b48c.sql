
-- Create table for opportunity files
CREATE TABLE public.opportunity_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id INTEGER REFERENCES public.opportunities(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for opportunity notes
CREATE TABLE public.opportunity_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id INTEGER REFERENCES public.opportunities(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for opportunity files
INSERT INTO storage.buckets (id, name, public) VALUES ('opportunity-files', 'opportunity-files', true);

-- Enable Row Level Security
ALTER TABLE public.opportunity_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_notes ENABLE ROW LEVEL SECURITY;

-- RLS policies for opportunity_files
CREATE POLICY "Users can view their own opportunity files" ON public.opportunity_files
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own opportunity files" ON public.opportunity_files
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own opportunity files" ON public.opportunity_files
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own opportunity files" ON public.opportunity_files
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for opportunity_notes
CREATE POLICY "Users can view their own opportunity notes" ON public.opportunity_notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own opportunity notes" ON public.opportunity_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own opportunity notes" ON public.opportunity_notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own opportunity notes" ON public.opportunity_notes
  FOR DELETE USING (auth.uid() = user_id);

-- Storage policies for opportunity files bucket
CREATE POLICY "Users can view their own files" ON storage.objects
  FOR SELECT USING (bucket_id = 'opportunity-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'opportunity-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'opportunity-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files" ON storage.objects
  FOR DELETE USING (bucket_id = 'opportunity-files' AND auth.uid()::text = (storage.foldername(name))[1]);
