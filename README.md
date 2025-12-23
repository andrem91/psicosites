# 🧠 PsicoSites

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org/)

**Plataforma SaaS para criação de sites profissionais para psicólogos e terapeutas.**

## 🎯 Sobre o Projeto

O PsicoSites é uma solução "no-code" que permite psicólogos criarem sites profissionais em 5 minutos, com:

- ✅ **Compliance automático** com normas do CFP
- 🚀 **SEO técnico** otimizado para captação de pacientes
- 💬 **Conversão via WhatsApp** com tracking
- 📱 **Design mobile-first** e responsivo
- 📝 **Blog integrado** para marketing de conteúdo

## 🛠️ Stack Tecnológica

| Tecnologia | Uso |
|------------|-----|
| Next.js 16 | Frontend + App Router |
| Tailwind CSS 4 | Estilização |
| Supabase | Auth, Database, Storage, Blog |
| Mercado Pago | Gateway de Pagamentos |
| Vercel | Hospedagem |

## 🚀 Começando

### Pré-requisitos
- Node.js 18+
- Docker Desktop
- Git

### Instalação

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/psicosites.git
cd psicosites/app

# Instalar dependências
npm install

# Iniciar Supabase local
npx supabase start

# Aplicar schema do banco
docker exec -i supabase_db_app psql -U postgres -d postgres < supabase/schema.sql

# Iniciar desenvolvimento
npm run dev
```

### Variáveis de Ambiente

Copie `.env.example` para `.env.local` e configure:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

## 📁 Estrutura do Projeto

```
app/
├── src/
│   ├── app/           # Páginas (App Router)
│   ├── components/    # Componentes React
│   │   └── ui/       # Componentes UI
│   ├── hooks/        # Custom hooks
│   ├── lib/          # Utilitários e Supabase
│   ├── styles/       # Estilos customizados
│   ├── types/        # Tipos TypeScript
│   └── middleware.ts # Proteção de rotas
├── supabase/
│   └── schema.sql    # Schema do banco
└── public/           # Assets estáticos
```

## 🔗 URLs Locais (Desenvolvimento)

| Serviço | URL |
|---------|-----|
| Next.js | http://localhost:3000 |
| Supabase Studio | http://127.0.0.1:54323 |
| API Supabase | http://127.0.0.1:54321 |
| Mailpit (emails) | http://127.0.0.1:54324 |

## 📄 Licença

Projeto privado - Todos os direitos reservados.

---

Desenvolvido com 💜 para a comunidade de psicólogos brasileiros.
