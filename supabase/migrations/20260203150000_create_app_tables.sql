CREATE TABLE IF NOT EXISTS public.app_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    login TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.app_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed default admin user
INSERT INTO public.app_users (login, password, is_admin)
VALUES ('Berg', 'c1c3r@1302', TRUE)
ON CONFLICT (login) DO NOTHING;

-- Enable RLS
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Allow public access for this custom auth implementation
-- In a real production scenario with standard Auth, this would be more restricted.
CREATE POLICY "Allow public access to app_users"
ON public.app_users
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public access to app_settings"
ON public.app_settings
FOR ALL
USING (true)
WITH CHECK (true);
