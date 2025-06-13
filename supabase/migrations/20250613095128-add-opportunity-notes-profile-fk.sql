
-- Add foreign key relationship between opportunity_notes and profiles
ALTER TABLE public.opportunity_notes 
ADD CONSTRAINT opportunity_notes_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
