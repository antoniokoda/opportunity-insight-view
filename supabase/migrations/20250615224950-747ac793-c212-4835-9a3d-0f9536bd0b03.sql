
-- Make salesperson_id nullable in opportunities table to allow for unassigned opportunities
ALTER TABLE public.opportunities 
ALTER COLUMN salesperson_id DROP NOT NULL;

-- Update the foreign key constraint to handle NULL values properly
-- First drop the existing constraint if it exists
ALTER TABLE public.opportunities 
DROP CONSTRAINT IF EXISTS opportunities_salesperson_id_fkey;

-- Add the foreign key constraint back with proper handling for NULL values
ALTER TABLE public.opportunities 
ADD CONSTRAINT opportunities_salesperson_id_fkey 
FOREIGN KEY (salesperson_id) 
REFERENCES public.salespeople(id) 
ON DELETE SET NULL;
