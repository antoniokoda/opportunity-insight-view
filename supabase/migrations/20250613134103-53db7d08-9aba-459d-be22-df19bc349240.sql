
-- Check existing policies and create missing ones for salespeople table
DO $$ 
BEGIN
    -- Enable RLS if not already enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'salespeople' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.salespeople ENABLE ROW LEVEL SECURITY;
    END IF;

    -- Create INSERT policy if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'salespeople' 
        AND policyname = 'Users can insert their own salespeople'
    ) THEN
        CREATE POLICY "Users can insert their own salespeople" ON public.salespeople
          FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Create UPDATE policy if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'salespeople' 
        AND policyname = 'Users can update their own salespeople'
    ) THEN
        CREATE POLICY "Users can update their own salespeople" ON public.salespeople
          FOR UPDATE USING (auth.uid() = user_id);
    END IF;

    -- Create DELETE policy if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'salespeople' 
        AND policyname = 'Users can delete their own salespeople'
    ) THEN
        CREATE POLICY "Users can delete their own salespeople" ON public.salespeople
          FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Check existing policies and create missing ones for lead_sources table
DO $$ 
BEGIN
    -- Enable RLS if not already enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'lead_sources' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.lead_sources ENABLE ROW LEVEL SECURITY;
    END IF;

    -- Create SELECT policy if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'lead_sources' 
        AND policyname = 'Users can view their own lead sources'
    ) THEN
        CREATE POLICY "Users can view their own lead sources" ON public.lead_sources
          FOR SELECT USING (auth.uid() = user_id);
    END IF;

    -- Create INSERT policy if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'lead_sources' 
        AND policyname = 'Users can insert their own lead sources'
    ) THEN
        CREATE POLICY "Users can insert their own lead sources" ON public.lead_sources
          FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Create UPDATE policy if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'lead_sources' 
        AND policyname = 'Users can update their own lead sources'
    ) THEN
        CREATE POLICY "Users can update their own lead sources" ON public.lead_sources
          FOR UPDATE USING (auth.uid() = user_id);
    END IF;

    -- Create DELETE policy if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'lead_sources' 
        AND policyname = 'Users can delete their own lead sources'
    ) THEN
        CREATE POLICY "Users can delete their own lead sources" ON public.lead_sources
          FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;
