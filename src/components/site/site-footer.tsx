import Link from "next/link";

interface SiteFooterProps {
    siteName: string;
    crp?: string;
    email?: string;
    whatsapp?: string;
    primaryColor?: string;
    showLgpd?: boolean;
}

export function SiteFooter({
    siteName,
    crp,
    email,
    whatsapp,
    primaryColor = "#6366f1",
    showLgpd = true,
}: SiteFooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Sobre */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">{siteName}</h3>
                        {crp && (
                            <p className="text-gray-400 text-sm">CRP: {crp}</p>
                        )}
                    </div>

                    {/* Contato */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contato</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            {email && (
                                <li>
                                    <a
                                        href={`mailto:${email}`}
                                        className="hover:text-white transition-colors"
                                    >
                                        📧 {email}
                                    </a>
                                </li>
                            )}
                            {whatsapp && (
                                <li>
                                    <a
                                        href={`https://wa.me/55${whatsapp.replace(/\D/g, "")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-white transition-colors"
                                    >
                                        📱 {whatsapp}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Links</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>
                                <Link href="/" className="hover:text-white transition-colors">
                                    Início
                                </Link>
                            </li>
                            <li>
                                <Link href="#contato" className="hover:text-white transition-colors">
                                    Contato
                                </Link>
                            </li>
                            {showLgpd && (
                                <>
                                    <li>
                                        <Link href="#" className="hover:text-white transition-colors">
                                            Política de Privacidade
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="hover:text-white transition-colors">
                                            Política de Cookies
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-sm">
                        © {currentYear} {siteName}. Todos os direitos reservados.
                    </p>

                    {/* Badge PsiBuilder */}
                    <a
                        href="https://psibuilder.com.br"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-500 text-xs hover:text-gray-400 transition-colors"
                    >
                        <span>Feito com</span>
                        <span
                            className="font-semibold px-2 py-1 rounded"
                            style={{ backgroundColor: primaryColor + "20", color: primaryColor }}
                        >
                            PsiBuilder
                        </span>
                    </a>
                </div>
            </div>

            {/* Certificado CFP */}
            <div className="bg-gray-950 py-3 px-4 text-center">
                <p className="text-gray-500 text-xs">
                    🏅 Site em conformidade com as normas do Conselho Federal de Psicologia (CFP)
                </p>
            </div>
        </footer>
    );
}
