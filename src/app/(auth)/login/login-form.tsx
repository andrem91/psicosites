"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { loginSchema, type LoginFormData } from "@/lib/schemas/auth";
import { loginWithEmail, loginWithMagicLink } from "../actions";

export function LoginForm() {
    const [mode, setMode] = useState<"password" | "magic">("password");
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: LoginFormData) {
        setServerError(null);
        setSuccess(null);

        // Convert to FormData for server action compatibility
        const formData = new FormData();
        formData.append("email", data.email);
        if (mode === "password") {
            formData.append("password", data.password);
        }

        const result =
            mode === "password"
                ? await loginWithEmail(formData)
                : await loginWithMagicLink(formData);

        if (result && "error" in result && result.error) {
            setServerError(result.error);
        }
        if (result && "success" in result && result.success && "message" in result) {
            setSuccess(result.message);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{serverError}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            <FieldGroup>
                <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                autoComplete="email"
                                aria-invalid={fieldState.invalid}
                                {...field}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                {mode === "password" && (
                    <>
                        <Controller
                            name="password"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        aria-invalid={fieldState.invalid}
                                        {...field}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <div className="text-right -mt-2">
                            <Link
                                href="/recuperar-senha"
                                className="text-sm text-indigo-600 hover:underline"
                            >
                                Esqueceu a senha?
                            </Link>
                        </div>
                    </>
                )}
            </FieldGroup>

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
                {mode === "password" ? "Entrar" : "Enviar link de acesso"}
            </Button>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-gray-500">ou</span>
                </div>
            </div>

            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => setMode(mode === "password" ? "magic" : "password")}
                    >
                        {mode === "password"
                            ? "Entrar com link mágico (sem senha)"
                            : "Entrar com email e senha"}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="max-w-xs">
                        {mode === "password"
                            ? "Receba um link de acesso no seu email. Sem precisar lembrar senha!"
                            : "Use sua senha para entrar mais rápido"}
                    </p>
                </TooltipContent>
            </Tooltip>
        </form>
    );
}

