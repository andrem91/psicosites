import Link from "next/link";
import { Metadata } from "next";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AtualizarSenhaForm } from "./atualizar-senha-form";

export const metadata: Metadata = {
    title: "Atualizar Senha | PsiBuilder",
    description: "Defina sua nova senha",
};

export default function AtualizarSenhaPage() {
    return (
        <Card className="w-full max-w-lg">
            <CardHeader className="text-center space-y-1">
                <CardTitle className="text-2xl">Criar Nova Senha</CardTitle>
                <CardDescription className="text-base">
                    Digite sua nova senha abaixo para recuperar o acesso à sua conta
                </CardDescription>
            </CardHeader>

            <CardContent className="px-8">
                <AtualizarSenhaForm />
            </CardContent>

            <CardFooter className="justify-center">
                <p className="text-sm text-gray-500">
                    Lembrou sua senha?{" "}
                    <Link
                        href="/login"
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                        Voltar ao login
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
