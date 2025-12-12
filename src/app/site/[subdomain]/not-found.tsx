import Link from "next/link";

interface SiteNotFoundProps {
    params: Promise<{ subdomain: string }>;
}

export default async function SiteNotFound({ params }: SiteNotFoundProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center px-4">
                <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Site não encontrado
                </h2>
                <p className="text-gray-500 mb-8">
                    Este site ainda não foi publicado ou não existe.
                </p>
                <Link
                    href="https://psibuilder.com.br"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Criar seu próprio site
                </Link>
            </div>
        </div>
    );
}
