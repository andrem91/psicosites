import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PsiBuilder - Crie seu Site Profissional de Psicologia",
  description: "A plataforma mais fácil para psicólogos criarem sites profissionais. Grátis, rápido e adequado às normas do CRP.",
  keywords: "psicólogo, site, psicologia, criador de site, CRP, site profissional",
  authors: [{ name: "PsiBuilder" }],
  openGraph: {
    title: "PsiBuilder - Site para Psicólogos",
    description: "Crie seu site profissional de psicologia em 5 minutos. Grátis, rápido e adequado às normas do CRP.",
    url: "https://psibuilder.com.br",
    siteName: "PsiBuilder",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PsiBuilder - Site para Psicólogos",
    description: "Crie seu site profissional de psicologia em 5 minutos.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

