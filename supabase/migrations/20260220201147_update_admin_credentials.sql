DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM public.app_users WHERE login = 'Berg') AND NOT EXISTS (SELECT 1 FROM public.app_users WHERE login = 'berg') THEN
        UPDATE public.app_users SET login = 'berg', password = 'c1c3r@1302', is_admin = TRUE WHERE login = 'Berg';
    ELSIF EXISTS (SELECT 1 FROM public.app_users WHERE login = 'Berg') THEN
        DELETE FROM public.app_users WHERE login = 'Berg';
    END IF;

    INSERT INTO public.app_users (login, password, is_admin)
    VALUES ('berg', 'c1c3r@1302', TRUE)
    ON CONFLICT (login) DO UPDATE SET password = 'c1c3r@1302', is_admin = TRUE;
END $$;
