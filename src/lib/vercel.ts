// src/lib/vercel.ts
// Cliente para API da Vercel - Gerenciamento automático de domínios

const VERCEL_API_URL = "https://api.vercel.com";

// Headers de autenticação
const getHeaders = () => ({
    Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
    "Content-Type": "application/json",
});

// Adiciona Team ID na URL se existir (necessário para contas Pro/Team)
const getUrl = (path: string) => {
    const teamId = process.env.VERCEL_TEAM_ID;
    if (!teamId) return `${VERCEL_API_URL}${path}`;

    const separator = path.includes("?") ? "&" : "?";
    return `${VERCEL_API_URL}${path}${separator}teamId=${teamId}`;
};

/**
 * Adiciona um domínio ao projeto na Vercel
 * @param domain - O domínio a ser adicionado (ex: "meusite.com.br")
 */
export async function addDomainToVercel(domain: string): Promise<{
    success: boolean;
    error?: string;
    data?: {
        name: string;
        verified: boolean;
        verification?: Array<{ type: string; domain: string; value: string }>;
    };
}> {
    const projectId = process.env.VERCEL_PROJECT_ID;
    const token = process.env.VERCEL_API_TOKEN;

    console.log("🔍 [Vercel API] Iniciando addDomainToVercel...");
    console.log("🔍 [Vercel API] Domain:", domain);
    console.log("🔍 [Vercel API] Project ID configurado:", projectId ? "✅ Sim" : "❌ Não");
    console.log("🔍 [Vercel API] Token configurado:", token ? "✅ Sim" : "❌ Não");

    if (!projectId || !token) {
        console.warn("⚠️ [Vercel API] Variáveis não configuradas - pulando adição automática");
        return { success: true }; // Fail silently para não bloquear fluxo
    }

    try {
        const url = getUrl(`/v10/projects/${projectId}/domains`);
        console.log("🔍 [Vercel API] URL:", url);

        const response = await fetch(url, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ name: domain }),
        });

        const data = await response.json();
        console.log("🔍 [Vercel API] Response status:", response.status);
        console.log("🔍 [Vercel API] Response data:", JSON.stringify(data, null, 2));

        if (!response.ok) {
            // Domínio já existe no projeto - não é erro
            if (data.error?.code === "domain_already_exists") {
                console.log("✅ [Vercel API] Domínio já existe no projeto");
                return { success: true, data };
            }

            // Domínio em uso por outro projeto
            if (data.error?.code === "domain_taken") {
                console.log("❌ [Vercel API] Domínio em uso por outro projeto");
                return {
                    success: false,
                    error: "Este domínio já está em uso por outro projeto. Se é seu, remova-o primeiro do outro projeto."
                };
            }

            console.log("❌ [Vercel API] Erro:", data.error?.message);
            return {
                success: false,
                error: data.error?.message || "Erro ao adicionar domínio na Vercel"
            };
        }

        console.log("✅ [Vercel API] Domínio adicionado com sucesso!");
        return { success: true, data };
    } catch (error) {
        console.error("❌ [Vercel API] Exceção:", error);
        return { success: true }; // Fail silently
    }
}

/**
 * Remove um domínio do projeto na Vercel
 * @param domain - O domínio a ser removido
 */
export async function removeDomainFromVercel(domain: string): Promise<boolean> {
    const projectId = process.env.VERCEL_PROJECT_ID;

    if (!projectId || !process.env.VERCEL_API_TOKEN) {
        console.warn("Vercel API não configurada - pulando remoção automática");
        return true;
    }

    try {
        const response = await fetch(
            getUrl(`/v9/projects/${projectId}/domains/${domain}`),
            {
                method: "DELETE",
                headers: getHeaders(),
            }
        );

        if (!response.ok) {
            const data = await response.json();
            // Se domínio não existe, não é erro
            if (data.error?.code === "not_found") {
                return true;
            }
            console.error("Erro ao remover domínio da Vercel:", data);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Erro ao chamar Vercel API:", error);
        return true; // Fail silently
    }
}

/**
 * Verifica o status de configuração DNS de um domínio
 * Retorna informações precisas sobre o que está pendente
 */
export async function getDomainConfig(domain: string): Promise<{
    isConfigured: boolean;
    isVerified: boolean;
    error?: string;
    verification?: Array<{ type: string; domain: string; value: string }>;
    message?: string;
}> {
    const projectId = process.env.VERCEL_PROJECT_ID;

    if (!projectId || !process.env.VERCEL_API_TOKEN) {
        // Fallback para verificação DNS manual se API não configurada
        return {
            isConfigured: false,
            isVerified: false,
            message: "Verificação via API não disponível. Use verificação DNS.",
        };
    }

    try {
        // Busca configuração do domínio
        const configResponse = await fetch(getUrl(`/v6/domains/${domain}/config`), {
            method: "GET",
            headers: getHeaders(),
        });

        const config = await configResponse.json();

        // Busca status do domínio no projeto
        const domainResponse = await fetch(
            getUrl(`/v9/projects/${projectId}/domains/${domain}`),
            {
                method: "GET",
                headers: getHeaders(),
            }
        );

        const domainData = await domainResponse.json();

        const isConfigured = config.misconfigured === false;
        const isVerified = domainData.verified === true;

        let message = "";
        if (isConfigured && isVerified) {
            message = "✅ Domínio ativo e funcionando com SSL!";
        } else if (!isConfigured) {
            message = "⚠️ DNS ainda não configurado. Siga as instruções abaixo.";
        } else if (!isVerified) {
            message = "⏳ Aguardando propagação do DNS (pode levar até 48h).";
        }

        return {
            isConfigured,
            isVerified,
            verification: domainData.verification,
            message,
        };
    } catch (error) {
        console.error("Erro ao verificar config do domínio:", error);
        return {
            isConfigured: false,
            isVerified: false,
            message: "Não foi possível verificar. Tente novamente.",
        };
    }
}
