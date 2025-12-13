import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Meu Site | PsiBuilder",
    description: "Configure e personalize seu site profissional",
};

export default function SitePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Meu Site</h1>
                <p className="text-gray-500 mt-1">
                    Configure e personalize seu site profissional
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                    <svg
                        className="w-8 h-8 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
                        />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Em desenvolvimento
                </h2>
                <p className="text-gray-500 max-w-md mx-auto">
                    O editor de site estará disponível em breve. Aqui você poderá personalizar cores, fontes, textos e imagens do seu site.
                </p>
            </div>
        </div>
    );
}
