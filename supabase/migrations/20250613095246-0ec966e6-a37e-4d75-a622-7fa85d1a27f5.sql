
-- Enable RLS on opportunity_notes table if not already enabled
ALTER TABLE public.opportunity_notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for opportunity_notes (these might not exist yet)
CREATE POLICY "Users can view notes for opportunities they have access to" 
  ON public.opportunity_notes 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.opportunities 
    WHERE id = opportunity_notes.opportunity_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own notes" 
  ON public.opportunity_notes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" 
  ON public.opportunity_notes 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" 
  ON public.opportunity_notes 
  FOR DELETE 
  USING (auth.uid() = user_id);
