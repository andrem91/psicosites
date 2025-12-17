import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type");
    const next = searchParams.get("next") ?? "/dashboard";

    const supabase = await createClient();

    // Password recovery flow with token_hash
    if (token_hash && type === "recovery") {
        const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: "recovery",
        });

        if (!error) {
            // Redirect to password update page
            const redirectUrl = getRedirectUrl(request, origin, "/atualizar-senha");
            return NextResponse.redirect(redirectUrl);
        }

        return NextResponse.redirect(`${origin}/login?error=invalid_recovery_link`);
    }

    // Standard code exchange flow (OAuth, magic link, email confirmation)
    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            const redirectUrl = getRedirectUrl(request, origin, next);
            return NextResponse.redirect(redirectUrl);
        }
    }

    // Error - redirect to login
    return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}

function getRedirectUrl(request: Request, origin: string, path: string): string {
    const forwardedHost = request.headers.get("x-forwarded-host");
    const isLocalEnv = process.env.NODE_ENV === "development";

    if (isLocalEnv) {
        return `${origin}${path}`;
    } else if (forwardedHost) {
        return `https://${forwardedHost}${path}`;
    } else {
        return `${origin}${path}`;
    }
}

