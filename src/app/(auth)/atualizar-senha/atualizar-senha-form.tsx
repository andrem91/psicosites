"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";

const updatePasswordSchema = z.object({
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirme sua senha"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
});

type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

export function AtualizarSenhaForm() {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [canUpdatePassword, setCanUpdatePassword] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<UpdatePasswordFormData>({
        resolver: zodResolver(updatePasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        const handleRecovery = async () => {
            const supabase = createClient();

            // Verifica se há hash na URL (tokens do Supabase)
            const hash = window.location.hash;

            if (hash && hash.includes("access_token")) {
                // Extrai os parâmetros do hash
                const hashParams = new URLSearchParams(hash.substring(1));
                const accessToken = hashParams.get("access_token");
                const refreshToken = hashParams.get("refresh_token");

                if (accessToken && refreshToken) {
                    // Define a sessão manualmente
                    const { error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    });

                    if (!error) {
                        setCanUpdatePassword(true);
                        setIsLoading(false);
                        // Limpa o hash da URL por segurança
                        window.history.replaceState(null, "", window.location.pathname);
                        return;
                    }
                }
            }

            // Fallback: verifica se já existe uma sessão
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                setCanUpdatePassword(true);
            }

            setIsLoading(false);
        };

        handleRecovery();
    }, []);

    async function onSubmit(data: UpdatePasswordFormData) {
        setServerError(null);

        const supabase = createClient();

        const { error } = await supabase.auth.updateUser({
            password: data.password,
        });

        if (error) {
            if (error.message.includes("same password")) {
                setServerError("A nova senha deve ser diferente da anterior");
            } else {
                setServerError(error.message);
            }
            return;
        }

        setSuccess(true);

        // Redireciona após 2 segundos
        setTimeout(() => {
            router.push("/dashboard");
        }, 2000);
    }

    if (isLoading) {
        return (
            <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
                <p className="text-gray-500">Verificando link de recuperação...</p>
            </div>
        );
    }

    if (!canUpdatePassword) {
        return (
            <div className="text-center py-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Link Inválido ou Expirado</h3>
                <p className="text-gray-500 text-sm mb-4">
                    O link de recuperação de senha é inválido ou já expirou.
                </p>
                <Button onClick={() => router.push("/recuperar-senha")}>
                    Solicitar novo link
                </Button>
            </div>
        );
    }

    if (success) {
        return (
            <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Senha Atualizada!</h3>
                <p className="text-gray-500 text-sm">
                    Sua senha foi alterada com sucesso. Redirecionando...
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{serverError}</AlertDescription>
                </Alert>
            )}

            <FieldGroup>
                <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="password">Nova senha</FieldLabel>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="new-password"
                                aria-invalid={fieldState.invalid}
                                {...field}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="confirmPassword">Confirmar nova senha</FieldLabel>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="new-password"
                                aria-invalid={fieldState.invalid}
                                {...field}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </FieldGroup>

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Atualizar senha
            </Button>
        </form>
    );
}
