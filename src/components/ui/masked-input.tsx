"use client";

import { forwardRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    mask: "whatsapp" | "crp" | "phone" | "cep";
    onValueChange?: (value: string) => void;
}

/**
 * Masks disponíveis:
 * - whatsapp: (11) 99999-9999
 * - crp: 06/12345
 * - phone: (11) 9999-9999 ou (11) 99999-9999
 * - cep: 12345-678
 */
export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
    ({ mask, className, onChange, onValueChange, value, ...props }, ref) => {
        const [displayValue, setDisplayValue] = useState("");

        // Aplica máscara ao valor
        const applyMask = (rawValue: string): string => {
            const digits = rawValue.replace(/\D/g, "");

            switch (mask) {
                case "whatsapp":
                case "phone":
                    if (digits.length <= 2) return digits;
                    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
                    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
                    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;

                case "crp":
                    if (digits.length <= 2) return digits;
                    return `${digits.slice(0, 2)}/${digits.slice(2, 8)}`;

                case "cep":
                    if (digits.length <= 5) return digits;
                    return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;

                default:
                    return rawValue;
            }
        };

        // Extrai valor sem máscara
        const extractValue = (maskedValue: string): string => {
            switch (mask) {
                case "crp":
                    // Mantém o formato XX/XXXXX para CRP
                    const crpDigits = maskedValue.replace(/\D/g, "");
                    if (crpDigits.length >= 2) {
                        return `${crpDigits.slice(0, 2)}/${crpDigits.slice(2)}`;
                    }
                    return crpDigits;
                default:
                    // Para outros, retorna só os dígitos
                    return maskedValue.replace(/\D/g, "");
            }
        };

        // Sincroniza valor externo
        useEffect(() => {
            if (value !== undefined) {
                setDisplayValue(applyMask(String(value)));
            }
        }, [value, mask]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const rawValue = e.target.value;
            const masked = applyMask(rawValue);
            const extracted = extractValue(masked);

            setDisplayValue(masked);

            // Notifica mudança de valor
            if (onValueChange) {
                onValueChange(extracted);
            }

            // Mantém compatibilidade com onChange
            if (onChange) {
                const syntheticEvent = {
                    ...e,
                    target: {
                        ...e.target,
                        value: extracted,
                    },
                };
                onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
            }
        };

        return (
            <input
                ref={ref}
                type="text"
                inputMode="numeric"
                value={displayValue}
                onChange={handleChange}
                className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background",
                    "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
                    "placeholder:text-muted-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "md:text-sm",
                    className
                )}
                {...props}
            />
        );
    }
);

MaskedInput.displayName = "MaskedInput";
