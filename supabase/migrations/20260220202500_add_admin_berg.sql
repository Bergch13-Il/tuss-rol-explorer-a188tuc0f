DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.app_users WHERE login = 'berg') THEN
        INSERT INTO public.app_users (login, password, is_admin)
        VALUES ('berg', 'c1c3r@1302', TRUE);
    ELSE
        UPDATE public.app_users
        SET password = 'c1c3r@1302',
            is_admin = TRUE
        WHERE login = 'berg';
    END IF;
END $$;
