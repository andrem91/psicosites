"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface OnboardingData {
    full_name: string;
    crp: string;
    whatsapp: string;
    bio: string;
    bio_short: string;
    specialties: string[];
}

// Salvar progresso do onboarding (step parcial)
export async function saveOnboardingStep(
    profileId: string,
    data: Partial<OnboardingData>
) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("profiles")
        .update({
            full_name: data.full_name,
            crp: data.crp,
            whatsapp: data.whatsapp,
            bio: data.bio,
            bio_short: data.bio_short,
            specialties: data.specialties,
            updated_at: new Date().toISOString(),
        })
        .eq("id", profileId);

    if (error) {
        return { error: "Erro ao salvar dados. Tente novamente." };
    }

    return { success: true };
}

// FAQs padrão para novos sites
const DEFAULT_FAQS = [
    {
        question: "Qual é a frequência e duração das sessões?",
        answer: "As sessões têm duração de aproximadamente 50 minutos. A frequência inicial recomendada é semanal, podendo ser ajustada conforme a evolução do processo terapêutico.",
    },
    {
        question: "Preciso ter um diagnóstico para começar a terapia?",
        answer: "Não. A psicoterapia é indicada para qualquer pessoa que deseje autoconhecimento, desenvolvimento pessoal ou ajuda para lidar com questões emocionais e comportamentais.",
    },
    {
        question: "A terapia funciona online?",
        answer: "Sim! O atendimento online é tão eficaz quanto o presencial e oferece mais flexibilidade. Utilizo plataformas seguras que garantem sigilo e qualidade na conexão.",
    },
    {
        question: "Como funciona o sigilo profissional?",
        answer: "Tudo o que é compartilhado em sessão é absolutamente confidencial, conforme o Código de Ética do Psicólogo. Suas informações nunca serão compartilhadas sem autorização.",
    },
    {
        question: "Quanto tempo dura o tratamento?",
        answer: "O tempo varia de acordo com os objetivos e necessidades de cada pessoa. Algumas questões podem ser trabalhadas em poucos meses, outras requerem acompanhamento mais longo.",
    },
];

// Conteúdo de ética padrão
const DEFAULT_ETHICS_CONTENT = `Ao iniciar o processo terapêutico, meu compromisso é oferecer um espaço seguro, acolhedor e pautado nos princípios éticos da Psicologia. Isso inclui:

• Sigilo absoluto: tudo o que é compartilhado em sessão é confidencial
• Respeito e acolhimento: cada paciente é único, sem julgamentos
• Base científica: utilizo métodos validados cientificamente
• Autonomia do paciente: você participa ativamente das decisões`;

// Completar onboarding e criar site
export async function completeOnboarding(
    profileId: string,
    data: OnboardingData
) {
    const supabase = await createClient();

    // 1. Atualizar perfil com todos os dados
    const { error: profileError } = await supabase
        .from("profiles")
        .update({
            full_name: data.full_name,
            crp: data.crp,
            whatsapp: data.whatsapp,
            bio: data.bio,
            specialties: data.specialties,
            updated_at: new Date().toISOString(),
        })
        .eq("id", profileId);

    if (profileError) {
        return { error: "Erro ao salvar perfil. Tente novamente." };
    }

    // 2. Gerar subdomain único baseado no nome
    const subdomain = generateSubdomain(data.full_name);

    // 3. Verificar se subdomain já existe
    const { data: existingSite } = await supabase
        .from("sites")
        .select("id")
        .eq("subdomain", subdomain)
        .single();

    // Se já existe, adicionar número aleatório
    const finalSubdomain = existingSite
        ? `${subdomain}-${Math.floor(Math.random() * 1000)}`
        : subdomain;

    // 4. Criar ou atualizar site
    const { data: existingUserSite } = await supabase
        .from("sites")
        .select("id")
        .eq("profile_id", profileId)
        .single();

    let siteId: string | null = null;

    if (existingUserSite) {
        siteId = existingUserSite.id;
        // Atualizar site existente
        const { error: siteError } = await supabase
            .from("sites")
            .update({
                is_published: true,
                site_title: `${data.full_name} - Psicólogo(a)`,
                meta_description: data.bio.substring(0, 160),
                show_ethics_section: true,
                ethics_content: DEFAULT_ETHICS_CONTENT,
                show_lgpd_section: true,
                theme_config: {
                    primaryColor: "#6366f1",
                    backgroundColor: "#ffffff",
                    fontFamily: "Inter",
                },
                updated_at: new Date().toISOString(),
            })
            .eq("id", existingUserSite.id);

        if (siteError) {
            return { error: "Erro ao atualizar site. Tente novamente." };
        }
    } else {
        // Criar novo site
        const { data: newSite, error: siteError } = await supabase
            .from("sites")
            .insert({
                profile_id: profileId,
                subdomain: finalSubdomain,
                is_published: true,
                site_title: `${data.full_name} - Psicólogo(a)`,
                meta_description: data.bio.substring(0, 160),
                show_ethics_section: true,
                ethics_content: DEFAULT_ETHICS_CONTENT,
                show_lgpd_section: true,
                theme_config: {
                    primaryColor: "#6366f1",
                    backgroundColor: "#ffffff",
                    fontFamily: "Inter",
                },
            })
            .select("id")
            .single();

        if (siteError || !newSite) {
            return { error: "Erro ao criar site. Tente novamente." };
        }

        siteId = newSite.id;
    }

    // 5. Criar FAQs padrão para o site (se ainda não existirem)
    if (siteId) {
        // Verificar se já tem FAQs
        const { data: existingFaqs } = await supabase
            .from("site_faqs")
            .select("id")
            .eq("site_id", siteId)
            .limit(1);

        if (!existingFaqs || existingFaqs.length === 0) {
            // Adicionar FAQs padrão
            const faqsToInsert = DEFAULT_FAQS.map((faq, index) => ({
                site_id: siteId,
                question: faq.question,
                answer: faq.answer,
                order_index: index,
                is_active: true,
            }));

            await supabase.from("site_faqs").insert(faqsToInsert);
        }
    }

    revalidatePath("/dashboard");
    return { success: true, subdomain: finalSubdomain };
}

// Helper para gerar subdomain a partir do nome
function generateSubdomain(name: string): string {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres especiais
        .trim()
        .replace(/\s+/g, "-") // Espaços para hífens
        .replace(/-+/g, "-") // Remove hífens duplicados
        .substring(0, 30); // Limita tamanho
}
