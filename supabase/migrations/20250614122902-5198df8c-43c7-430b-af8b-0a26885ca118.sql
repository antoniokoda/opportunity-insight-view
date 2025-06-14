
-- Create a view that joins opportunity_notes with profiles to get user names
CREATE OR REPLACE VIEW public.opportunity_notes_with_users AS
SELECT
  notes.*,
  p.name as user_name,
  p.email as user_email
FROM public.opportunity_notes AS notes
LEFT JOIN public.profiles p ON notes.user_id = p.id;

-- Grant select permissions on the view to authenticated users
GRANT SELECT ON public.opportunity_notes_with_users TO authenticated;
