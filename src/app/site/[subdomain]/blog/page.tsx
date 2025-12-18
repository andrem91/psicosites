import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface BlogPageProps {
    params: Promise<{ subdomain: string }>;
}

interface ThemeConfig {
    primaryColor?: string;
}

interface SiteData {
    id: string;
    subdomain: string;
    show_blog: boolean | null;
    theme_config: ThemeConfig | null;
    profiles: { full_name: string | null } | null;
}

// Função para buscar dados do site
async function getSiteData(subdomain: string): Promise<SiteData | null> {
    const supabase = await createClient();

    const { data: site } = await supabase
        .from("sites")
        .select(`
            id,
            subdomain,
            show_blog,
            theme_config,
            profiles (
                full_name
            )
        `)
        .or(`subdomain.eq.${subdomain},custom_domain.eq.${subdomain}`)
        .eq("is_published", true)
        .single();

    return site as SiteData | null;
}

export default async function BlogListPage({ params }: BlogPageProps) {
    const { subdomain } = await params;
    const site = await getSiteData(subdomain);

    if (!site) {
        notFound();
    }

    // Se o blog estiver desativado, retornar 404
    if (site.show_blog === false) {
        notFound();
    }

    const supabase = await createClient();
    const theme = site.theme_config || {};
    const primaryColor = theme.primaryColor || "#6366f1";

    // Buscar posts publicados
    const { data: posts } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("site_id", site.id)
        .eq("is_published", true)
        .order("published_at", { ascending: false });

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="py-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
                    <p className="text-xl text-gray-600">
                        Artigos e reflexões sobre saúde mental e bem-estar
                    </p>
                </div>

                {/* Lista de posts */}
                {posts && posts.length > 0 ? (
                    <div className="grid gap-8">
                        {posts.map((post) => (
                            <article
                                key={post.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <Link href={`/blog/${post.slug}`} className="flex flex-col md:flex-row">
                                    {/* Imagem */}
                                    {post.featured_image_url ? (
                                        <div className="relative w-full md:w-72 h-48">
                                            <Image
                                                src={post.featured_image_url}
                                                alt={post.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, 288px"
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className="w-full md:w-72 h-48 flex items-center justify-center"
                                            style={{ backgroundColor: `${primaryColor}15` }}
                                        >
                                            <svg
                                                className="w-16 h-16"
                                                style={{ color: primaryColor }}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                                />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Conteúdo */}
                                    <div className="p-6 flex-1">
                                        <time className="text-sm text-gray-500">
                                            {formatDate(post.published_at || post.created_at)}
                                        </time>
                                        <h2 className="text-xl font-bold text-gray-900 mt-2 mb-3 group-hover:text-indigo-600">
                                            {post.title}
                                        </h2>
                                        <p className="text-gray-600 line-clamp-2">
                                            {post.excerpt || "Clique para ler o artigo completo..."}
                                        </p>
                                        <span
                                            className="inline-flex items-center gap-1 mt-4 text-sm font-medium"
                                            style={{ color: primaryColor }}
                                        >
                                            Ler artigo
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div
                            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                            style={{ backgroundColor: `${primaryColor}15` }}
                        >
                            <svg
                                className="w-10 h-10"
                                style={{ color: primaryColor }}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Ainda não há artigos publicados
                        </h2>
                        <p className="text-gray-500">
                            Volte em breve para conferir novos conteúdos!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
