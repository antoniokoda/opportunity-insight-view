
-- Deshabilitar RLS y eliminar TODAS las políticas de TODAS las tablas

-- 1. CALLS TABLE - Deshabilitar RLS y eliminar todas las políticas
ALTER TABLE public.calls DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own calls" ON public.calls;
DROP POLICY IF EXISTS "Users can insert their own calls" ON public.calls;
DROP POLICY IF EXISTS "Users can update their own calls" ON public.calls;
DROP POLICY IF EXISTS "Users can delete their own calls" ON public.calls;
DROP POLICY IF EXISTS "Users can create their own calls" ON public.calls;

-- 2. OPPORTUNITIES TABLE - Deshabilitar RLS y eliminar todas las políticas
ALTER TABLE public.opportunities DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can insert their own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can update their own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can delete their own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can create their own opportunities" ON public.opportunities;

-- 3. SALESPEOPLE TABLE - Deshabilitar RLS y eliminar todas las políticas
ALTER TABLE public.salespeople DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own salespeople" ON public.salespeople;
DROP POLICY IF EXISTS "Users can insert their own salespeople" ON public.salespeople;
DROP POLICY IF EXISTS "Users can update their own salespeople" ON public.salespeople;
DROP POLICY IF EXISTS "Users can delete their own salespeople" ON public.salespeople;
DROP POLICY IF EXISTS "Users can create their own salespeople" ON public.salespeople;

-- 4. LEAD_SOURCES TABLE - Deshabilitar RLS y eliminar todas las políticas
ALTER TABLE public.lead_sources DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own lead sources" ON public.lead_sources;
DROP POLICY IF EXISTS "Users can insert their own lead sources" ON public.lead_sources;
DROP POLICY IF EXISTS "Users can update their own lead sources" ON public.lead_sources;
DROP POLICY IF EXISTS "Users can delete their own lead sources" ON public.lead_sources;
DROP POLICY IF EXISTS "Users can create their own lead sources" ON public.lead_sources;

-- 5. OPPORTUNITY_CONTACTS TABLE - Deshabilitar RLS y eliminar todas las políticas
ALTER TABLE public.opportunity_contacts DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own opportunity contacts" ON public.opportunity_contacts;
DROP POLICY IF EXISTS "Users can insert their own opportunity contacts" ON public.opportunity_contacts;
DROP POLICY IF EXISTS "Users can update their own opportunity contacts" ON public.opportunity_contacts;
DROP POLICY IF EXISTS "Users can delete their own opportunity contacts" ON public.opportunity_contacts;
DROP POLICY IF EXISTS "Users can create their own opportunity contacts" ON public.opportunity_contacts;

-- 6. OPPORTUNITY_FILES TABLE - Deshabilitar RLS y eliminar todas las políticas
ALTER TABLE public.opportunity_files DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own opportunity files" ON public.opportunity_files;
DROP POLICY IF EXISTS "Users can insert their own opportunity files" ON public.opportunity_files;
DROP POLICY IF EXISTS "Users can update their own opportunity files" ON public.opportunity_files;
DROP POLICY IF EXISTS "Users can delete their own opportunity files" ON public.opportunity_files;
DROP POLICY IF EXISTS "Users can create their own opportunity files" ON public.opportunity_files;
DROP POLICY IF EXISTS "Users can view files for their own opportunities" ON public.opportunity_files;

-- 7. OPPORTUNITY_NOTES TABLE - Deshabilitar RLS y eliminar todas las políticas
ALTER TABLE public.opportunity_notes DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own opportunity notes" ON public.opportunity_notes;
DROP POLICY IF EXISTS "Users can insert their own opportunity notes" ON public.opportunity_notes;
DROP POLICY IF EXISTS "Users can update their own opportunity notes" ON public.opportunity_notes;
DROP POLICY IF EXISTS "Users can delete their own opportunity notes" ON public.opportunity_notes;
DROP POLICY IF EXISTS "Users can create their own opportunity notes" ON public.opportunity_notes;
DROP POLICY IF EXISTS "Users can view notes for their own opportunities" ON public.opportunity_notes;

-- 8. PROFILES TABLE - Deshabilitar RLS y eliminar todas las políticas
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

-- Verificar que NO queden políticas RLS en ninguna tabla
-- (Este comando solo es para verificación, no elimina nada)
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
