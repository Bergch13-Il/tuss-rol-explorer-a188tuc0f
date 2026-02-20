DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'app_users') THEN
        IF EXISTS (SELECT 1 FROM public.app_users WHERE login = 'Berg') AND NOT EXISTS (SELECT 1 FROM public.app_users WHERE login = 'berg') THEN
            UPDATE public.app_users SET login = 'berg', password = 'c1c3r@1302', is_admin = TRUE WHERE login = 'Berg';
        ELSIF EXISTS (SELECT 1 FROM public.app_users WHERE login = 'Berg') THEN
            DELETE FROM public.app_users WHERE login = 'Berg';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM public.app_users WHERE login = 'berg') THEN
            INSERT INTO public.app_users (login, password, is_admin)
            VALUES ('berg', 'c1c3r@1302', TRUE);
        ELSE
            UPDATE public.app_users SET password = 'c1c3r@1302', is_admin = TRUE WHERE login = 'berg';
        END IF;
    END IF;
END $$;
