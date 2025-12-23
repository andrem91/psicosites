# Plano de Negócios: PsiBuilder

**Versão:** 2.0 (Final Consolidada)
**Modelo:** SaaS (Software as a Service) Vertical "No-Code"
**Estratégia:** Product-Led Growth (Freemium + Viralidade)
**Stack Tecnológica:** Next.js 16, Tailwind 4, Supabase, Sanity.io, Vercel

---

## 1. Resumo Executivo

O **PsiBuilder** é uma plataforma tecnológica que democratiza o acesso a sites de alta performance para psicólogos e terapeutas. Através de uma arquitetura *Multi-Tenant* moderna, oferecemos sites rápidos, otimizados para conversão (WhatsApp) e com SEO técnico automático, tudo gerido por um painel 100% *self-service*.

**A Proposta de Valor:** "Tenha seu site profissional no ar em 5 minutos, sem precisar de desenvolvedor, agência ou conhecimentos técnicos, começando de graça."

**O Diferencial:** Diferente de construtores genéricos (Wix, WordPress), o PsiBuilder é "opinionado": ele já nasce com a estrutura de informação, design e funcionalidades que um psicólogo precisa (ética, sigilo, blog terapêutico), eliminando a complexidade de configuração.

---

## 2. Análise de Mercado

### 2.1 O Problema
Psicólogos recém-formados e profissionais liberais enfrentam um dilema digital:
1.  **Agências são caras:** Sites sob medida custam acima de R$ 2.000,00 e cobram manutenção.
2.  **Wordpress é complexo:** Exige gestão de hospedagem, plugins, segurança e atualizações constantes.
3.  **Links na Bio são limitados:** Não passam autoridade profissional nem indexam bem no Google (SEO).

### 2.2 A Solução PsiBuilder
Uma plataforma onde o psicólogo se cadastra e o site é gerado instantaneamente. A tecnologia resolve a infraestrutura (performance, segurança, mobile) e o conteúdo (blog, textos prontos), permitindo que o profissional foque apenas no atendimento.

### 2.3 Público-Alvo
* **Segmento Primário:** Psicólogos clínicos autônomos (CRP ativo) que dependem de captação particular.
* **Segmento Secundário:** Terapeutas holísticos e psicanalistas que buscam posicionamento digital.

---

## 3. O Produto (Plataforma Tecnológica)

### 3.1 Experiência do Usuário (UX)
O foco é a **autonomia total**. Não há interação humana para colocar o site no ar.

1.  **Dashboard do Psicólogo:** Painel administrativo intuitivo (construído com Shadcn/ui).
    * **Onboarding:** Wizard passo-a-passo (Dados Pessoais -> Escolha de Tema -> Publicar).
    * **Editor de Perfil:** Atualização em tempo real de foto, bio e contatos.
    * **Seletor de Temas:** Opções visuais pré-configuradas (Cores/Fontes) via variáveis CSS.
2.  **Site Gerado:**
    * Performance de elite (Next.js 16 + Server Components).
    * Botão de WhatsApp flutuante nativo.
    * Design responsivo e acessível.

### 3.2 Funcionalidades Específicas
* **Blog Integrado (Sanity):** Módulo de publicação de artigos com editor de texto rico, focado em SEO de conteúdo (atração de pacientes orgânica).
* **Biblioteca de Conteúdo:** Acervo de textos pré-escritos sobre temas comuns (Ansiedade, Depressão) disponíveis para assinantes copiarem e adaptarem.
* **Analytics Privado:** Métricas essenciais (Visitas e Cliques no WhatsApp) exibidas dentro do painel, respeitando a LGPD (sem cookies invasivos).

---

## 4. Modelo de Negócio e Preços

A estratégia é **Freemium Viral**. O plano gratuito serve como ferramenta de marketing massivo, enquanto o plano pago entrega as ferramentas de crescimento profissional.

### 4.1 Tabela de Planos

| Recurso | **Plano Gratuito** (Entrada) | **Plano Profissional** (Receita) |
| :--- | :--- | :--- |
| **Site** | One-Page (Cartão de Visita Digital) | Site Completo (Multi-páginas) |
| **Domínio** | Subdomínio (`psi.b/nome`) | **Domínio Próprio** (`drnome.com`) |
| **Blog** | 🔒 Bloqueado (Gatilho de Upgrade) | ✅ **Liberado e Ilimitado** |
| **Conteúdo** | 🔒 Visualização Apenas | ✅ **Biblioteca Completa** |
| **Analytics** | Básico (Visitas Gerais) | ✅ **Detalhado (Conversão)** |
| **Branding** | Rodapé "Crie seu site grátis" | ✅ Rodapé "Crie seu site grátis" |
| **Preço** | **R$ 0,00** | **R$ 89,90 / mês** |

*Nota Estratégica:* Manter o branding no plano pago transforma cada cliente de sucesso em um canal de aquisição de novos clientes.

### 4.2 Fontes de Receita Adicional (Futuro)
* **Revenda de E-mail Profissional:** Integração com Google Workspace/Zoho (Margem sobre a revenda).
* **Plano Enterprise (Clínicas):** Gestão de múltiplos profissionais e agenda unificada.

---

## 5. Plano Operacional e Técnico

A execução técnica prioriza uma arquitetura escalável e de baixo custo fixo inicial.

### 5.1 Stack Tecnológica
* **Frontend:** Next.js 16 (App Router) + Tailwind CSS 4.
* **Backend & Auth:** **Supabase** (Postgres, Auth, Storage, Edge Functions).
* **CMS de Conteúdo:** **Sanity.io** (apenas para o módulo de Blog/Textos).
* **Pagamentos:** **Asaas** (Boleto, Pix, Cartão de Crédito, Assinaturas Recorrentes).
* **Infraestrutura:** Vercel (Hospedagem e Edge Middleware).

### 5.2 Roadmap de Desenvolvimento

#### **Fase 1: Fundação (Mês 1)**
* Configuração do Monorepo e Docker (Ambiente de desenvolvimento local).
* Modelagem do Banco de Dados no Supabase (`profiles`, `sites`, `analytics`).
* Implementação do Middleware de Roteamento Multi-Tenant (detecção de subdomínios e domínios próprios).
* Integração Supabase Auth (Login Social e Magic Link).

#### **Fase 2: O Painel e o Site (Mês 2)**
* Desenvolvimento do Dashboard do Cliente (Formulários de edição).
* Criação dos Temas Visuais (Variáveis CSS no Tailwind).
* Desenvolvimento do Frontend público dos sites (Renderização dinâmica baseada no DB).
* Integração com Sanity para o módulo de Blog.

#### **Fase 3: Automação e Lançamento (Mês 3)**
* Integração completa com **Asaas** (assinaturas, webhooks, gestão de cobranças).
* Tutorial guiado de configuração de DNS para domínios próprios.
* Certificado de Compliance CFP (badge de conformidade).
* Botão WhatsApp com tracking de conversão.
* Criação da "Biblioteca de Conteúdo" inicial (textos genéricos).
* Testes de carga e segurança (RLS).
* **Lançamento Oficial do MVP.**

---

## 6. Análise Financeira (Unit Economics)

A estrutura *serverless* permite um custo operacional extremamente baixo, maximizando a margem de lucro.

### 6.1 Estrutura de Custos
* **Custos Fixos:**
    * Vercel Pro: ~$20 USD/mês.
    * Domínio da Plataforma: ~R$ 40,00/ano.
* **Custos Variáveis (por usuário):**
    * Supabase: Gratuito até limites generosos (500MB DB / 50k MAU). Após isso, custo por uso (baixo).
    * Sanity: Gratuito (Tier generoso).
    * Taxas de Pagamento: ~3% a 5% sobre a transação.

### 6.2 Projeção de Break-even
Com apenas **3 a 4 assinantes pagos** (R$ 89,90/mês), a operação cobre todos os custos fixos de infraestrutura inicial. A partir desse ponto, a receita é majoritariamente lucro operacional para reinvestimento e remuneração.

---

## 7. Estratégia de Go-to-Market (Lançamento)

1.  **Lançamento Beta "Founder's Club":** Oferta especial para os primeiros 50 usuários (ex: desconto vitalício ou meses grátis no plano Pro) para testar a plataforma e gerar feedback.
2.  **Marketing de Conteúdo:** Utilizar o próprio blog da plataforma para publicar artigos sobre "Marketing para Psicólogos", atraindo tráfego qualificado.
3.  **Prova Social:** Incentivar os primeiros usuários a colocarem o link do site na bio do Instagram, ativando o loop viral através do rodapé "Powered by PsiBuilder".

---

Este plano consolida o **PsiBuilder** como uma empresa de tecnologia enxuta, escalável e focada na dor real do cliente, pronta para ser desenvolvida.


