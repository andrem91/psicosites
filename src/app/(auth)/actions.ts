"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { translateError } from "@/lib/translations/errors";

export type AuthResult = {
    error?: string;
    success?: boolean;
    message?: string;
};

export async function loginWithEmail(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: translateError(error.message) };
    }

    redirect("/dashboard");
}

export async function loginWithMagicLink(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
    });

    if (error) {
        return { error: translateError(error.message) };
    }

    return { success: true, message: "Link de acesso enviado para seu email!" };
}

export async function signUp(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
    });

    if (error) {
        return { error: translateError(error.message) };
    }

    // Redireciona para página de confirmação de email
    redirect("/confirmar-email");
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
}

export async function loginWithGoogle() {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
    });

    if (error) {
        return { error: translateError(error.message) };
    }

    if (data.url) {
        redirect(data.url);
    }
}

export async function requestPasswordReset(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/atualizar-senha`,
    });

    if (error) {
        return { error: translateError(error.message) };
    }

    return { success: true };
}

