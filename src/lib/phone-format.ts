/**
 * Formata número de telefone brasileiro
 * @param phone Número (pode ter ou não formatação)
 * @returns Número formatado: (11) 99999-9999 ou (11) 9999-9999
 */
export function formatPhone(phone: string | undefined | null): string {
    if (!phone) return "";

    // Remove tudo que não é número
    const digits = phone.replace(/\D/g, "");

    // Celular: 11 dígitos (com DDD e 9)
    if (digits.length === 11) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }

    // Fixo: 10 dígitos (com DDD)
    if (digits.length === 10) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }

    // Se não encaixa em nenhum padrão, retorna sem formato
    return phone;
}
