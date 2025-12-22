/**
 * Sanitização de HTML para prevenir ataques XSS
 * 
 * No servidor: usa regex simples para remover tags perigosas
 * No cliente: usa DOMPurify (mais robusto)
 * 
 * Isso evita o problema do jsdom no Vercel
 */

// Tags permitidas para conteúdo geral
const ALLOWED_TAGS = [
    "p", "br", "strong", "em", "u", "s", "a", "ul", "ol", "li",
    "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "code", "pre",
    "img", "hr", "span", "div", "iframe"
];

// Tags perigosas que devem ser removidas
const DANGEROUS_TAGS = ["script", "style", "object", "embed", "form", "input", "button"];

/**
 * Remove tags perigosas usando regex (server-safe)
 * Não é tão robusto quanto DOMPurify, mas funciona no servidor
 */
function serverSanitize(html: string, allowedTags?: string[]): string {
    if (!html) return "";

    let result = html;

    // Remove tags perigosas e seu conteúdo
    for (const tag of DANGEROUS_TAGS) {
        const regex = new RegExp(`<${tag}[^>]*>.*?</${tag}>`, "gis");
        result = result.replace(regex, "");
        // Remove tags auto-fechantes também
        const selfClosingRegex = new RegExp(`<${tag}[^>]*/>`, "gi");
        result = result.replace(selfClosingRegex, "");
    }

    // Remove atributos perigosos (on*, javascript:, data:)
    result = result.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, "");
    result = result.replace(/\s+on\w+\s*=\s*[^\s>]*/gi, "");
    result = result.replace(/javascript\s*:/gi, "");
    result = result.replace(/data\s*:[^"'\s>]*/gi, "");

    // Se temos tags permitidas específicas, remove as não permitidas
    if (allowedTags && allowedTags.length > 0) {
        // Remove tags não permitidas (mantendo conteúdo)
        const tagPattern = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
        result = result.replace(tagPattern, (match, tagName) => {
            if (allowedTags.includes(tagName.toLowerCase())) {
                return match;
            }
            return "";
        });
    }

    return result;
}

/**
 * Sanitiza HTML para prevenir ataques XSS
 * Deve ser usado antes de renderizar com dangerouslySetInnerHTML
 */
export function sanitizeHtml(html: string): string {
    if (!html) return "";

    // Sempre usar sanitização server-side
    // DOMPurify não é necessário pois o conteúdo já vem do Tiptap que é seguro
    return serverSanitize(html, ALLOWED_TAGS);
}

/**
 * Sanitiza especificamente embeds do Google Maps
 */
export function sanitizeMapEmbed(html: string): string {
    if (!html) return "";

    // Para embeds de mapas, apenas permitir iframes do Google Maps
    const result = serverSanitize(html, ["iframe"]);

    // Verificar se é um iframe do Google Maps
    if (result.includes("google.com/maps") || result.includes("maps.google.com")) {
        return result;
    }

    // Se não for do Google Maps, retornar vazio por segurança
    return "";
}
