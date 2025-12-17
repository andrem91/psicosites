import { Metadata } from "next";
import Link from "next/link";
import { PasswordRecoveryForm } from "./password-recovery-form";

export const metadata: Metadata = {
    title: "Recuperar Senha | PsiBuilder",
    description: "Recupere sua senha do PsiBuilder",
};

export default function RecuperarSenhaPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">P</span>
                        </div>
                        <span className="text-2xl font-bold text-gray-900">PsiBuilder</span>
                    </div>
                    <h1 className="text-xl font-semibold text-gray-900">Recuperar Senha</h1>
                    <p className="text-gray-500 mt-1">
                        Digite seu email para receber um link de recuperação
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <PasswordRecoveryForm />
                </div>

                {/* Back to login */}
                <p className="text-center mt-6 text-sm text-gray-500">
                    Lembrou a senha?{" "}
                    <Link href="/login" className="text-indigo-600 hover:underline font-medium">
                        Voltar ao login
                    </Link>
                </p>
            </div>
        </div>
    );
}
