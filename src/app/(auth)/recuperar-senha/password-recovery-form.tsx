"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { recoverPasswordSchema, type RecoverPasswordFormData } from "@/lib/schemas/auth";
import { requestPasswordReset } from "../actions";

export function PasswordRecoveryForm() {
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<RecoverPasswordFormData>({
        resolver: zodResolver(recoverPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(data: RecoverPasswordFormData) {
        setServerError(null);
        setSuccess(false);

        const formData = new FormData();
        formData.append("email", data.email);

        const result = await requestPasswordReset(formData);

        if (result && "error" in result && result.error) {
            setServerError(result.error as string);
        } else if (result && "success" in result && result.success) {
            setSuccess(true);
        }
    }

    if (success) {
        return (
            <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Email Enviado!</h3>
                <p className="text-gray-500 text-sm">
                    Se existe uma conta com esse email, você receberá um link para redefinir sua senha.
                </p>
                <p className="text-gray-400 text-xs mt-4">
                    Não recebeu? Verifique sua pasta de spam.
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
            </FieldGroup>

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Enviar link de recuperação
            </Button>
        </form>
    );
}
