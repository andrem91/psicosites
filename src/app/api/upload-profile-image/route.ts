import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

// Configurações de imagem
const IMAGE_CONFIG = {
    profile: {
        maxSize: 1024,      // 1024x1024 max
        quality: 85,        // Qualidade JPEG
        format: 'jpeg' as const,
    },
    logo: {
        maxSize: 512,       // 512x512 max
        quality: 90,        // Qualidade mais alta para logos
        format: 'png' as const,
    },
    blog: {
        maxSize: 1200,      // 1200px max (ideal para Open Graph)
        quality: 85,        // Boa qualidade
        format: 'jpeg' as const,
    },
};

export async function POST(request: NextRequest) {
    // Rate limit: 5 requests per 10 seconds (strict for uploads)
    const ip = getClientIP(request);
    const rateLimitResult = await checkRateLimit(ip, "strict");
    if ("status" in rateLimitResult) {
        return rateLimitResult; // Rate limited
    }

    try {
        // Verificar autenticação do usuário
        const supabase = await createServerClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Não autorizado" },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;
        const profileId = formData.get("profileId") as string;
        const uploadType = (formData.get("type") as string) || "profile";

        // Para uploads de blog, profileId é opcional
        if (!file) {
            return NextResponse.json(
                { error: "Arquivo ausente" },
                { status: 400 }
            );
        }

        // Para profile e logo, profileId é obrigatório
        if (uploadType !== "blog" && !profileId) {
            return NextResponse.json(
                { error: "profileId é obrigatório para este tipo de upload" },
                { status: 400 }
            );
        }

        // Verificar se a service key está disponível
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

        if (!serviceKey || !supabaseUrl) {
            return NextResponse.json(
                { error: "Configuração de Storage não disponível" },
                { status: 500 }
            );
        }

        // Cliente admin com service role para bypass RLS
        const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        });

        // Obter configuração baseada no tipo de upload
        const config = uploadType === "logo"
            ? IMAGE_CONFIG.logo
            : uploadType === "blog"
                ? IMAGE_CONFIG.blog
                : IMAGE_CONFIG.profile;

        // Converter arquivo para buffer
        const arrayBuffer = await file.arrayBuffer();
        const inputBuffer = Buffer.from(arrayBuffer);

        // Processar imagem com Sharp
        let processedBuffer: Buffer;
        let outputFormat: string;

        try {
            const image = sharp(inputBuffer);
            const metadata = await image.metadata();

            // Corrigir orientação EXIF automaticamente (fotos de celular)
            // e redimensionar se maior que o tamanho máximo
            let pipeline = image.rotate(); // .rotate() sem parâmetros corrige EXIF automaticamente

            if (metadata.width && metadata.height) {
                const maxDimension = Math.max(metadata.width, metadata.height);
                if (maxDimension > config.maxSize) {
                    pipeline = pipeline.resize(config.maxSize, config.maxSize, {
                        fit: 'inside',           // Mantém proporção, não corta
                        withoutEnlargement: true // Não aumenta imagens pequenas
                    });
                }
            }

            // Aplicar formato e compressão
            if (config.format === 'jpeg') {
                processedBuffer = await pipeline
                    .jpeg({ quality: config.quality, mozjpeg: true })
                    .toBuffer();
                outputFormat = 'jpg';
            } else {
                processedBuffer = await pipeline
                    .png({ quality: config.quality, compressionLevel: 9 })
                    .toBuffer();
                outputFormat = 'png';
            }

        } catch (sharpError) {
            console.error("Sharp processing error:", sharpError);
            // Fallback: usar imagem original se Sharp falhar
            processedBuffer = inputBuffer;
            outputFormat = file.name.split(".").pop() || 'jpg';
        }

        // Gerar nome único para o arquivo
        const fileName = `${uploadType}-${profileId}-${Date.now()}.${outputFormat}`;

        // Upload para Supabase Storage usando cliente admin
        const { data: _uploadData, error: uploadError } = await supabaseAdmin.storage
            .from("profile-images")
            .upload(fileName, processedBuffer, {
                contentType: `image/${outputFormat}`,
                upsert: true,
            });

        if (uploadError) {
            console.error("Upload error:", uploadError);
            return NextResponse.json(
                { error: `Erro ao fazer upload: ${uploadError.message}` },
                { status: 500 }
            );
        }

        // Obter URL pública
        const {
            data: { publicUrl },
        } = supabaseAdmin.storage.from("profile-images").getPublicUrl(fileName);

        // Para uploads de blog, apenas retorna a URL (não atualiza profile)
        if (uploadType === "blog") {
            return NextResponse.json({
                url: publicUrl,
                originalSize: Math.round(inputBuffer.length / 1024),
                processedSize: Math.round(processedBuffer.length / 1024),
            });
        }

        // Atualizar perfil com a URL da imagem usando cliente admin
        const updateField = uploadType === "logo" ? "logo_url" : "profile_image_url";

        const { error: updateError } = await supabaseAdmin
            .from("profiles")
            .update({
                [updateField]: publicUrl,
                updated_at: new Date().toISOString(),
            })
            .eq("id", profileId);

        if (updateError) {
            console.error("Update error:", updateError);
            return NextResponse.json(
                { error: "Erro ao atualizar perfil" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            url: publicUrl,
            originalSize: Math.round(inputBuffer.length / 1024),
            processedSize: Math.round(processedBuffer.length / 1024),
        });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}
