import { SiteSectionProps } from "@/types/site-types";
import { sanitizeHtml } from "@/lib/sanitize";
import { Instagram, Linkedin, Facebook, Youtube, Twitter } from "lucide-react";

interface SocialLinks {
    instagram?: string;
    linkedin?: string;
    facebook?: string;
    youtube?: string;
    tiktok?: string;
    twitter?: string;
}

interface SiteAboutProps extends SiteSectionProps {
    bio?: string;
    socialLinks?: SocialLinks;
}

// Ícone customizado do TikTok (não existe no lucide-react)
function TikTokIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
        </svg>
    );
}

export function SiteAboutSection({ bio, primaryColor, socialLinks }: SiteAboutProps) {
    const socialItems = [
        { key: "instagram", url: socialLinks?.instagram, icon: Instagram, label: "Instagram" },
        { key: "linkedin", url: socialLinks?.linkedin, icon: Linkedin, label: "LinkedIn" },
        { key: "facebook", url: socialLinks?.facebook, icon: Facebook, label: "Facebook" },
        { key: "youtube", url: socialLinks?.youtube, icon: Youtube, label: "YouTube" },
        { key: "tiktok", url: socialLinks?.tiktok, icon: TikTokIcon, label: "TikTok" },
        { key: "twitter", url: socialLinks?.twitter, icon: Twitter, label: "X" },
    ].filter(item => item.url);

    return (
        <section id="sobre" className="py-20 px-4 bg-white">
            <div className="max-w-3xl mx-auto">
                <h2
                    className="text-3xl font-bold mb-8 text-center"
                    style={{ color: primaryColor }}
                >
                    Sobre mim
                </h2>
                {bio ? (
                    <div
                        className="prose prose-lg max-w-none text-gray-600 prose-headings:text-gray-800 prose-a:text-indigo-600 prose-blockquote:border-indigo-500 text-center [&_p]:text-center [&_h2]:text-center [&_h3]:text-center"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(bio) }}
                    />
                ) : (
                    <p className="text-gray-600 text-lg leading-relaxed text-center">
                        Psicólogo(a) comprometido(a) com o bem-estar e a saúde mental dos meus pacientes. Ofereço um espaço seguro e acolhedor para que você possa expressar seus sentimentos e trabalhar em direção a uma vida mais equilibrada e feliz.
                    </p>
                )}

                {/* Redes Sociais */}
                {socialItems.length > 0 && (
                    <div className="flex justify-center gap-4 mt-8">
                        {socialItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <a
                                    key={item.key}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={item.label}
                                    className="p-3 rounded-full transition-all hover:scale-110"
                                    style={{
                                        backgroundColor: `${primaryColor}15`,
                                        color: primaryColor,
                                    }}
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
