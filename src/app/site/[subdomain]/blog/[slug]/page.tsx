import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { sanitizeHtml } from "@/lib/sanitize";

interface BlogPostPageProps {
    params: Promise<{ subdomain: string; slug: string }>;
}

interface SiteProfile {
    full_name: string | null;
    profile_image_url: string | null;
    crp: string | null;
}

interface ThemeConfig {
    primaryColor?: string;
}

interface SiteData {
    id: string;
    subdomain: string;
    theme_config: ThemeConfig | null;
    profiles: SiteProfile | null;
}

// Função para buscar dados do site
async function getSiteData(subdomain: string): Promise<SiteData | null> {
    const supabase = await createClient();

    const { data: site } = await supabase
        .from("sites")
        .select(`
            id,
            subdomain,
            theme_config,
            profiles (
                full_name,
                profile_image_url,
                crp
            )
        `)
        .or(`subdomain.eq.${subdomain},custom_domain.eq.${subdomain}`)
        .eq("is_published", true)
        .single();

    return site as SiteData | null;
}

// Função para buscar post
async function getPost(siteId: string, slug: string) {
    const supabase = await createClient();

    const { data: post } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("site_id", siteId)
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

    return post;
}

// Metadata dinâmica para SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { subdomain, slug } = await params;
    const site = await getSiteData(subdomain);

    if (!site) return { title: "Post não encontrado" };

    const post = await getPost(site.id, slug);

    if (!post) return { title: "Post não encontrado" };

    const profileName = site.profiles?.full_name || "Psicólogo";

    return {
        title: `${post.title} | ${profileName}`,
        description: post.excerpt || post.title,
        openGraph: {
            title: post.title,
            description: post.excerpt || post.title,
            images: post.featured_image_url ? [post.featured_image_url] : [],
            type: "article",
            publishedTime: post.published_at,
        },
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { subdomain, slug } = await params;
    const site = await getSiteData(subdomain);

    if (!site) {
        notFound();
    }

    const post = await getPost(site.id, slug);

    if (!post) {
        notFound();
    }

    const profile = site.profiles;
    const theme = site.theme_config || {};
    const primaryColor = theme.primaryColor || "#6366f1";

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <article className="py-16 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Voltar ao Blog
                    </Link>
                </nav>

                {/* Header do post */}
                <header className="mb-8">
                    <time className="text-sm text-gray-500">
                        {formatDate(post.published_at || post.created_at)}
                    </time>
                    <h1 className="text-4xl font-bold text-gray-900 mt-3 mb-6">
                        {post.title}
                    </h1>

                    {/* Autor */}
                    <div className="flex items-center gap-4">
                        {profile?.profile_image_url ? (
                            <div className="relative w-12 h-12">
                                <Image
                                    src={profile.profile_image_url}
                                    alt={profile.full_name || ""}
                                    fill
                                    className="rounded-full object-cover"
                                    sizes="48px"
                                />
                            </div>
                        ) : (
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                                style={{ backgroundColor: primaryColor }}
                            >
                                {profile?.full_name?.charAt(0)?.toUpperCase() || "P"}
                            </div>
                        )}
                        <div>
                            <p className="font-medium text-gray-900">{profile?.full_name}</p>
                            {profile?.crp && (
                                <p className="text-sm text-gray-500">CRP {profile.crp}</p>
                            )}
                        </div>
                    </div>
                </header>

                {/* Imagem de capa */}
                {post.featured_image_url && (
                    <div className="relative w-full aspect-video mb-8">
                        <Image
                            src={post.featured_image_url}
                            alt={post.title}
                            fill
                            className="rounded-2xl object-cover"
                            sizes="(max-width: 768px) 100vw, 768px"
                            priority
                        />
                    </div>
                )}

                {/* Conteúdo */}
                <div
                    className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-indigo-600 prose-img:rounded-lg"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content || "") }}
                />

                {/* CTA */}
                <div
                    className="mt-12 p-8 rounded-2xl text-center"
                    style={{ backgroundColor: `${primaryColor}10` }}
                >
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                        Precisa de ajuda profissional?
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Agende uma consulta e comece sua jornada de autoconhecimento.
                    </p>
                    <Link
                        href="/#contato"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium transition-opacity hover:opacity-90"
                        style={{ backgroundColor: primaryColor }}
                    >
                        Agendar Consulta
                    </Link>
                </div>
            </div>
        </article>
    );
}
