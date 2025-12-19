import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://psicosites.com.br';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/dashboard/',      // Área privada do usuário
                    '/api/',            // APIs internas
                    '/auth/',           // Rotas de autenticação
                    '/_next/',          // Arquivos internos do Next.js
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
