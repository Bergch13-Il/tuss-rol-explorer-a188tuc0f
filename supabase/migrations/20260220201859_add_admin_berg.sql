-- Seed specified admin user
INSERT INTO public.app_users (login, password, is_admin)
VALUES ('berg', 'c1c3r@1302', TRUE)
ON CONFLICT (login) DO UPDATE 
SET password = EXCLUDED.password, 
    is_admin = EXCLUDED.is_admin;
