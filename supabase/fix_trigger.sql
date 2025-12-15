-- Script para recriar o trigger handle_new_user
-- Execute no Supabase Studio: http://127.0.0.1:54323 > SQL Editor

-- Recriar a função
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Criar perfil básico
    INSERT INTO public.profiles (user_id, full_name, email, whatsapp, crp)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Novo Psicólogo'),
        NEW.email,
        '',
        ''
    );
    
    -- Criar assinatura gratuita
    INSERT INTO public.subscriptions (user_id, plan, status)
    VALUES (NEW.id, 'free', 'active');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recriar o trigger (dropar se existir)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verificar se o trigger foi criado
SELECT tgname, tgrelid::regclass 
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';
