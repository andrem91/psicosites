/**
 * Tradução de erros do Supabase Auth para português
 */

const ERROR_TRANSLATIONS: Record<string, string> = {
    // Login errors
    "Invalid login credentials": "Email ou senha incorretos",
    "Email not confirmed": "Por favor, confirme seu email antes de entrar",
    "Invalid email or password": "Email ou senha inválidos",

    // Signup errors
    "User already registered": "Este email já está cadastrado",
    "Password should be at least 6 characters": "A senha deve ter no mínimo 6 caracteres",
    "Signup requires a valid password": "Por favor, insira uma senha válida",
    "Unable to validate email address: invalid format": "Formato de email inválido",

    // Password reset errors
    "Email rate limit exceeded": "Muitas tentativas. Aguarde alguns minutos e tente novamente",
    "Password recovery requires an email": "Por favor, insira seu email",
    "New password should be different from the old password": "A nova senha deve ser diferente da anterior",

    // Session errors
    "JWT expired": "Sua sessão expirou. Por favor, faça login novamente",
    "Invalid Refresh Token": "Sessão inválida. Por favor, faça login novamente",
    "Refresh token not found": "Sessão não encontrada. Por favor, faça login novamente",

    // Rate limiting
    "For security purposes, you can only request this once every 60 seconds":
        "Por segurança, aguarde 60 segundos antes de tentar novamente",

    // OAuth errors
    "Provider not enabled": "Este método de login não está disponível",

    // Generic errors
    "Database error saving new user": "Erro ao criar conta. Tente novamente",
    "Something went wrong": "Algo deu errado. Tente novamente",
};

/**
 * Traduz mensagem de erro do Supabase para português
 * Se não houver tradução, retorna a mensagem original
 */
export function translateError(error: string): string {
    // Verifica correspondência exata
    if (ERROR_TRANSLATIONS[error]) {
        return ERROR_TRANSLATIONS[error];
    }

    // Verifica correspondência parcial
    for (const [key, translation] of Object.entries(ERROR_TRANSLATIONS)) {
        if (error.toLowerCase().includes(key.toLowerCase())) {
            return translation;
        }
    }

    // Retorna mensagem original se não houver tradução
    return error;
}
