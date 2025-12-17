"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/masked-input";
import { Field, FieldLabel, FieldError, FieldGroup, FieldDescription } from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ProfileImageUpload } from "@/components/ui/profile-image-upload";
import { OnboardingProgress } from "./onboarding-progress";
import { saveOnboardingStep, completeOnboarding } from "@/app/dashboard/onboarding/actions";
import {
    onboardingStep1Schema,
    onboardingStep2Schema,
    onboardingStep3Schema,
    type OnboardingStep1Data,
    type OnboardingStep2Data,
    type OnboardingStep3Data,
} from "@/lib/schemas/onboarding";

interface OnboardingWizardProps {
    initialData?: {
        full_name?: string;
        crp?: string;
        whatsapp?: string;
        bio?: string;
        bio_short?: string;
        specialties?: string[];
    };
    profileId: string;
}

export function OnboardingWizard({ initialData, profileId }: OnboardingWizardProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [currentStep, setCurrentStep] = useState(1);
    const [serverError, setServerError] = useState<string | null>(null);

    // Dados combinados de todos os steps
    const [formData, setFormData] = useState({
        full_name: initialData?.full_name || "",
        crp: initialData?.crp || "",
        whatsapp: initialData?.whatsapp || "",
        bio: initialData?.bio || "",
        bio_short: initialData?.bio_short || "",
        specialties: initialData?.specialties || [],
    });
    const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(undefined);

    const totalSteps = 3;

    const steps = [
        { label: "Dados", completed: currentStep > 1 },
        { label: "CRP", completed: currentStep > 2 },
        { label: "Finalizar", completed: false },
    ];

    // Form para Step 1
    const step1Form = useForm<OnboardingStep1Data>({
        resolver: zodResolver(onboardingStep1Schema),
        defaultValues: {
            full_name: formData.full_name,
            whatsapp: formData.whatsapp,
        },
    });

    // Form para Step 2
    const step2Form = useForm<OnboardingStep2Data>({
        resolver: zodResolver(onboardingStep2Schema),
        defaultValues: {
            crp: formData.crp,
        },
    });

    // Form para Step 3
    const step3Form = useForm<OnboardingStep3Data>({
        resolver: zodResolver(onboardingStep3Schema),
        defaultValues: {
            bio_short: formData.bio_short,
            bio: formData.bio,
        },
    });

    // Handler para Step 1
    const handleStep1Submit = async (data: OnboardingStep1Data) => {
        setServerError(null);
        const newFormData = { ...formData, ...data };
        setFormData(newFormData);

        startTransition(async () => {
            const result = await saveOnboardingStep(profileId, newFormData);
            if (result.error) {
                setServerError(result.error);
                return;
            }
            setCurrentStep(2);
        });
    };

    // Handler para Step 2
    const handleStep2Submit = async (data: OnboardingStep2Data) => {
        setServerError(null);
        const newFormData = { ...formData, ...data };
        setFormData(newFormData);

        startTransition(async () => {
            const result = await saveOnboardingStep(profileId, newFormData);
            if (result.error) {
                setServerError(result.error);
                return;
            }
            setCurrentStep(3);
        });
    };

    // Handler para Step 3 (finalização)
    const handleStep3Submit = async (data: OnboardingStep3Data) => {
        setServerError(null);
        const finalFormData = { ...formData, ...data };

        startTransition(async () => {
            const result = await completeOnboarding(profileId, finalFormData);
            if (result.error) {
                setServerError(result.error);
                return;
            }
            router.push("/dashboard?onboarding=complete");
        });
    };

    return (
        <div className="max-w-2xl mx-auto">
            <OnboardingProgress
                currentStep={currentStep}
                totalSteps={totalSteps}
                steps={steps}
            />

            {/* Server Error message */}
            {serverError && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{serverError}</AlertDescription>
                </Alert>
            )}

            {/* Step 1: Dados básicos */}
            {currentStep === 1 && (
                <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="space-y-6">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Vamos começar! 👋
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Primeiro, nos conte um pouco sobre você
                        </p>
                    </div>

                    {/* Photo Upload */}
                    <div className="flex justify-center mb-8">
                        <ProfileImageUpload
                            currentImage={profileImageUrl}
                            profileId={profileId}
                            onUpload={(url) => setProfileImageUrl(url)}
                        />
                    </div>

                    <FieldGroup>
                        <Controller
                            name="full_name"
                            control={step1Form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="full_name">Nome completo</FieldLabel>
                                    <Input
                                        id="full_name"
                                        placeholder="Dr(a). Maria Silva"
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
                            name="whatsapp"
                            control={step1Form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="whatsapp">WhatsApp</FieldLabel>
                                    <MaskedInput
                                        id="whatsapp"
                                        mask="whatsapp"
                                        placeholder="(11) 99999-9999"
                                        aria-invalid={fieldState.invalid}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    />
                                    <FieldDescription>
                                        Este será o número exibido no seu site
                                    </FieldDescription>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <div className="flex justify-end mt-8">
                        <Button type="submit" isLoading={isPending}>
                            Próximo
                        </Button>
                    </div>
                </form>
            )}

            {/* Step 2: CRP */}
            {currentStep === 2 && (
                <form onSubmit={step2Form.handleSubmit(handleStep2Submit)} className="space-y-6">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Seu registro profissional 📋
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Informe seu CRP para validarmos seu cadastro
                        </p>
                    </div>

                    <FieldGroup>
                        <Controller
                            name="crp"
                            control={step2Form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="crp">Número do CRP</FieldLabel>
                                    <MaskedInput
                                        id="crp"
                                        mask="crp"
                                        placeholder="06/12345"
                                        aria-invalid={fieldState.invalid}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    />
                                    <FieldDescription>
                                        O CRP será exibido no seu site para transmitir credibilidade.
                                    </FieldDescription>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <div className="flex justify-between mt-8">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCurrentStep(1)}
                            disabled={isPending}
                        >
                            Voltar
                        </Button>
                        <Button type="submit" isLoading={isPending}>
                            Próximo
                        </Button>
                    </div>
                </form>
            )}

            {/* Step 3: Bio */}
            {currentStep === 3 && (
                <form onSubmit={step3Form.handleSubmit(handleStep3Submit)} className="space-y-6">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Quase lá! ✨
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Escreva sua apresentação para os pacientes
                        </p>
                    </div>

                    <FieldGroup>
                        <Controller
                            name="bio_short"
                            control={step3Form.control}
                            render={({ field, fieldState }) => {
                                const charCount = field.value?.length || 0;
                                const maxChars = 150;
                                const isOverLimit = charCount > maxChars;
                                const isNearLimit = charCount > maxChars * 0.8;

                                return (
                                    <Field data-invalid={fieldState.invalid || isOverLimit}>
                                        <FieldLabel htmlFor="bio_short">
                                            Frase de apresentação (exibida no topo do site)
                                        </FieldLabel>
                                        <Input
                                            id="bio_short"
                                            placeholder="Ex: Psicóloga especialista em ansiedade e autoestima"
                                            aria-invalid={fieldState.invalid || isOverLimit}
                                            {...field}
                                        />
                                        <div className="flex justify-between items-center">
                                            <FieldDescription>
                                                Uma frase curta que resume sua atuação
                                            </FieldDescription>
                                            <span className={`text-xs font-medium ${isOverLimit
                                                    ? 'text-red-500'
                                                    : isNearLimit
                                                        ? 'text-amber-500'
                                                        : 'text-gray-400'
                                                }`}>
                                                {charCount}/{maxChars}
                                            </span>
                                        </div>
                                        {isOverLimit && (
                                            <p className="text-xs text-red-500 mt-1">
                                                Limite de {maxChars} caracteres excedido
                                            </p>
                                        )}
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                );
                            }}
                        />

                        <Controller
                            name="bio"
                            control={step3Form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>
                                        Sobre mim (texto completo com formatação)
                                    </FieldLabel>
                                    <div className="border border-gray-300 rounded-xl overflow-hidden">
                                        <RichTextEditor
                                            content={field.value}
                                            onChange={field.onChange}
                                            placeholder="Conte um pouco sobre sua formação, experiência e abordagem terapêutica..."
                                        />
                                    </div>
                                    <FieldDescription>
                                        Use os controles acima para formatar o texto.
                                    </FieldDescription>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <div className="flex justify-between mt-8">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCurrentStep(2)}
                            disabled={isPending}
                        >
                            Voltar
                        </Button>
                        <Button
                            type="submit"
                            isLoading={isPending}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Criar meu site! 🚀
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
