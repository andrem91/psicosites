# 🗺️ Roadmap - PsicoSites

**Última atualização:** Janeiro/2026  
**Versão:** 2.6 (Beta Program Added)

---

## 📌 Status Geral

| Fase | Status | Descrição |
|------|--------|-----------|
| **Fase 1 - Base** | ✅ Concluída | Auth, Dashboard, Profiles |
| **Fase 2 - Sites** | ✅ Concluída | Editor, Personalização, Publicação |
| **Fase 3 - Engajamento** | ✅ Concluída | Blog, SEO, Estatísticas |
| **Fase 4 - Polimento** | 🔄 Em andamento | UX, Performance, Correções |
| **Fase 5 - Admin** | 📋 Planejada | Painel administrativo da plataforma |
| **Fase 6 - Feedback** | 📋 Planejada | Sistema de feedback e sugestões |
| **Fase 7 - Monetização** | ⏳ Pré-lançamento | Mercado Pago, Planos funcionais |
| **Fase 8 - Beta Program** | 📋 Planejada | Pro grátis para testers |
| **Fase 9 - Diferenciação** | 📋 Planejada | Templates, Domínio Customizado |
| **Fase 10 - Expansão** | 📋 Planejada | Agenda, Integrações |

---

## ✅ MVP - Funcionalidades Implementadas

### 🔐 Autenticação e Usuários
- [x] Login/Cadastro com Supabase Auth
- [x] Gestão de perfil do psicólogo
- [x] Onboarding gamificado (wizard 4 steps)
- [x] Upload de foto de perfil e logo

### 🌐 Editor de Sites
- [x] Personalização de cores (cor primária, secundária)
- [x] Editor de texto rico (Tiptap) para "Sobre mim"
- [x] Frase de apresentação (bio_short)
- [x] Configuração de horários de atendimento
- [x] Upload de imagens otimizado (Sharp)
- [x] Preview do site em tempo real
- [x] Toggle para Blog opcional

### 📄 Página Pública do Psicólogo
- [x] Layout responsivo mobile-first
- [x] Seção Hero com CTA
- [x] Seção Sobre
- [x] Seção Especialidades
- [x] Seção FAQs (editável)
- [x] Seção Depoimentos (editável)
- [x] Formulário de contato funcional (Resend)
- [x] Botão flutuante WhatsApp
- [x] SEO básico (meta tags)

### 📝 Blog Integrado
- [x] CRUD completo de artigos
- [x] Editor com formatação (Tiptap)
- [x] Upload de imagem de capa
- [x] Rascunho vs Publicado
- [x] Página pública /blog
- [x] Página do artigo /blog/[slug]
- [x] SEO com Open Graph
- [x] Toggle para ativar/desativar blog público

### 📊 Estatísticas
- [x] Page views
- [x] Visitantes únicos
- [x] Cliques no WhatsApp
- [x] Cliques em CTA
- [x] Fontes de tráfego (referrers)
- [x] Dashboard visual com gráficos

### ⚙️ Infraestrutura
- [x] Supabase configurado (migrações consolidadas)
- [x] Storage com bucket profile-images
- [x] Políticas RLS otimizadas
- [x] Deploy Vercel pronto
- [x] Middleware para subdomínios
- [x] Lazy loading de imagens (next/image)
- [x] Compressão de imagens (Sharp)

---

## 🔄 Fase 4: Polimento (Em Andamento)

### 🟢 Simples (1-2 horas cada)

#### Dashboard
| Item | Descrição | Status |
|------|-----------|--------|
| Dark mode | Toggle claro/escuro no dashboard | ⏳ Pendente |
| Preview mobile/desktop | Toggle para ver site em diferentes tamanhos | ⏳ Pendente |
| Duplicar artigo do blog | Botão para clonar post existente | ⏳ Pendente |
| Notificações in-app | Badge no menu quando há novidade | ⏳ Pendente |
| Comparativo de períodos | "Este mês vs mês passado" nas stats | ⏳ Pendente |
| Reorganizar Ética/LGPD | Mover de /site para /conta, renomear para "Privacidade" | ⏳ Pendente |
| Remover seção Ética do site público | Deixar apenas na página de Privacidade | ⏳ Pendente |
| Campo Gênero no onboarding | Obrigatório para personalizar nomenclatura | ✅ Concluído |
| Campo Título Profissional | Opcional, ex: "Psicóloga Clínica", "Neuropsicólogo" | ✅ Concluído |

#### Nomenclatura e Gênero
| Item | Descrição | Status |
|------|-----------|--------|
| Substituir "Psicólogo(a)" | Usar gênero do perfil (Psicólogo/Psicóloga) | ✅ Concluído |
| Título baseado em especialidade | Ex: "Especialista em Ansiedade" se não tiver título | ⏳ Pendente |
| Atualizar landing page | Usar termos inclusivos/neutros onde necessário | ⏳ Pendente |
| Atualizar textos do dashboard | Personalizar saudações e labels | ⏳ Pendente |

#### Página Pública do Psicólogo
| Item | Descrição | Status |
|------|-----------|--------|
| Redes sociais dinâmicas | Instagram, LinkedIn, Facebook, TikTok, YouTube | ✅ Concluído |
| Vídeo de apresentação | Embed de YouTube/Vimeo no hero (opcional) | ✅ Concluído |
| Certificações/Formações | Seção com cursos e especializações | ✅ Concluído |
| Preços/Valores | Tabela de preços (opcional) | ✅ Concluído |
| Botão Instagram flutuante | Além do WhatsApp | ✅ Concluído |
| Horários de atendimento | "Seg-Sex, 8h-20h" com dias e horários | ✅ Concluído |
| Metodologias/Abordagens | TCC, Psicanálise, Gestalt, EMDR, etc | ✅ Concluído |
| Público-alvo | Crianças, adultos, casais, idosos, empresas | ✅ Concluído |
| Idiomas de atendimento | "Atendo em Inglês, Espanhol" | ✅ Concluído |
| Badge Online/Presencial no Hero | Indicar tipo de atendimento no hero | ✅ Concluído |
| Remover especialidades do Hero | Mover para seção própria | ✅ Concluído |

#### Logo para Psicólogos (Sem Logo)
| Item | Descrição | Status | Prioridade |
|------|-----------|--------|------------|
| Iniciais automáticas | Avatar com iniciais do nome se não tiver logo | ✅ Concluído | MVP |
| Nome estilizado | Exibir nome com tipografia bonita se não tiver logo | ⏳ Pendente | MVP |
| Templates de logo prontos | 5-10 ícones relacionados a psicologia | ⏳ Pendente | v2 |
| Gerador de logo simples | Escolher ícone + cor + iniciais | ⏳ Pendente | v2 |
| Geração com IA | Criar logo baseado no nome e especialidade | ⏳ Pendente | Futuro |

#### Analytics
| Item | Descrição | Status |
|------|-----------|--------|
| Exportar estatísticas CSV | Botão para download de dados | ⏳ Pendente |
| Scroll depth tracking | Medir 25%, 50%, 75%, 100% | ⏳ Pendente |
| Dispositivo analytics | Mobile/Desktop/Tablet | ⏳ Pendente |
| Horário de pico | Quando mais acessam o site | ⏳ Pendente |

#### Infraestrutura SaaS (Pré-Lançamento)
| Item | Descrição | Status | Ferramenta |
|------|-----------|--------|------------|
| Rate limiting | Proteger APIs de abuso | ✅ Concluído | Upstash (grátis) |
| Error tracking | Saber quando algo quebra | ✅ Concluído | Sentry (grátis) |
| Uptime monitoring | Saber se o site caiu | ⏳ Pendente | UptimeRobot (grátis) |

---

### 🟡 Médio (2-4 horas cada)

#### Dashboard
| Item | Descrição | Status |
|------|-----------|--------|
| Tour guiado novos usuários | Intro.js ou similar no primeiro acesso | ⏳ Pendente |
| Indicador força de senha | Barra visual (zxcvbn) | ⏳ Pendente |
| Histórico de alterações | Log de quando publicou/editou | ⏳ Pendente |
| Agendamento de posts | Publicar artigo em data futura | ⏳ Pendente |
| Limit 3 especialidades Free | Restringir plano gratuito | ⏳ Pendente |

#### Página Pública do Psicólogo
| Item | Descrição | Status |
|------|-----------|--------|
| Selo "Verificado CRP" | Badge visual de verificação | ⏳ Pendente |

#### Analytics
| Item | Descrição | Status |
|------|-----------|--------|
| Tempo na página | Quanto tempo visitante fica | ⏳ Pendente |
| Taxa de rejeição | Bounce rate | ⏳ Pendente |
| Funil de conversão | Visitou → Clicou WhatsApp → Enviou msg | ⏳ Pendente |
| Metas/Objetivos | Definir meta de cliques e acompanhar | ⏳ Pendente |

#### Performance
| Item | Descrição | Status |
|------|-----------|--------|
| PWA (Progressive Web App) | Dashboard instalável no celular | ⏳ Pendente |
| Cache otimizado | ISR/SSG para páginas públicas | ⏳ Pendente |

---

### 🟠 Complexo (4-8 horas cada)

| Item | Descrição | Status |
|------|-----------|--------|
| Galeria de fotos consultório | Upload múltiplo + carrossel | ⏳ Pendente |
| Notificações de novos contatos | Email ao psicólogo quando recebe msg | ⏳ Pendente |
| Geolocalização visitantes | De onde acessam (país/cidade) | ⏳ Pendente |
| Mapa de calor (heatmap) | Onde clicam na página | ⏳ Pendente |

---

## 🎨 Design System - Sites dos Psicólogos

> Melhorias visuais e de UX para os sites gerados

### Tipografia

| Item | Descrição | Status |
|------|-----------|--------|
| Sistema de fontes hierárquico | Títulos (Playfair/Lora) + Corpo (Inter) | ⏳ Pendente |
| Seletor de combinações de fonte | Clássico, Moderno, Acolhedor | ⏳ Pendente |
| Tipografia responsiva | Tamanhos menores no mobile | ⏳ Pendente |

### Rodapé (Footer)

| Item | Descrição | Status |
|------|-----------|--------|
| Reestruturar layout | Colunas: Navegação, Redes Sociais, Contato | ⏳ Pendente |
| Links de navegação | Início, Sobre, Especialidades, Blog, Contato | ⏳ Pendente |
| Redes sociais no footer | Ícones das redes configuradas | ⏳ Pendente |
| Endereço do consultório | Exibir se atende presencial | ⏳ Pendente |
| Mover políticas | Privacidade e Cookies na linha inferior | ⏳ Pendente |
| Crédito PsicoSites | "Desenvolvido por PsicoSites" | ⏳ Pendente |

### Melhorias Visuais

| Item | Descrição | Status |
|------|-----------|--------|
| Gradientes no Hero | Background com gradiente suave | ⏳ Pendente |
| Animações sutis | Texto/botões com fade-in | ⏳ Pendente |
| Layout Sobre | Imagem maior + texto ao lado | ⏳ Pendente |
| Cards com hover effect | Elevação e transição suave | ⏳ Pendente |
| Carousel depoimentos | Transição suave entre slides | ⏳ Pendente |
| Accordion FAQ | Animação de abertura/fechamento | ⏳ Pendente |
| Seção CTA destacada | Background diferenciado | ⏳ Pendente |
| Espaçamento entre seções | Padding maior e consistente | ⏳ Pendente |
| Bordas arredondadas | rounded-2xl padrão | ⏳ Pendente |
| Sombras suaves | Elevação sutil em cards | ⏳ Pendente |

### Elementos Decorativos

| Item | Descrição | Status |
|------|-----------|--------|
| Dividers entre seções | Linhas ou formas sutis | ⏳ Pendente |
| Background patterns | Ondas, dots sutis em seções | ⏳ Pendente |
| Ícones consistentes | Mesmo estilo (outline ou filled) | ⏳ Pendente |
| Paleta expandida | Tons claros da cor primária | ⏳ Pendente |
| Botões com gradiente | Gradiente sutil no CTA | ⏳ Pendente |

### Responsividade

| Item | Descrição | Status |
|------|-----------|--------|
| Imagens otimizadas | Aspect ratio correto em todos tamanhos | ⏳ Pendente |
| Menu mobile | Animação de abertura suave | ⏳ Pendente |
| Touch targets | Botões min 44px no mobile | ⏳ Pendente |

---

## 🔍 SEO - Landing Page (PsicoSites)

> Melhorias de SEO para a plataforma principal

| Item | Descrição | Status |
|------|-----------|--------|
| Sitemap.xml | /sitemap.xml da plataforma | ⏳ Pendente |
| robots.txt | Configuração para crawlers | ⏳ Pendente |
| Schema.org Organization | Dados estruturados da empresa | ⏳ Pendente |
| Schema.org SoftwareApplication | Dados do produto | ⏳ Pendente |
| Open Graph otimizado | og:image, twitter:card | ⏳ Pendente |

---

## 🔍 SEO - Sites dos Psicólogos

> Melhorias de SEO para os sites gerados

| Item | Descrição | Status |
|------|-----------|--------|
| Sitemap.xml dinâmico | /sitemap.xml por subdomínio | ⏳ Pendente |
| Schema.org Person | Dados do psicólogo | ⏳ Pendente |
| Schema.org LocalBusiness | Dados do consultório | ⏳ Pendente |
| Schema.org ProfessionalService | Tipo de serviço | ⏳ Pendente |
| Schema.org Article | Para posts do blog | ⏳ Pendente |
| Schema.org FAQPage | Para seção FAQ | ⏳ Pendente |

---

## �️ Fase 5: Módulo Admin

> Documentação técnica completa: [ADMIN_PLAN.md](./ADMIN_PLAN.md)

### Fase 5.1 - Essencial (MVP Admin)

| Item | Descrição | Status |
|------|-----------|--------|
| Middleware admin | Verificar role antes de acessar `/admin` | ⏳ Pendente |
| Tabela admin_roles | Migration + seed inicial | ⏳ Pendente |
| Layout admin | Sidebar, header, estrutura | ⏳ Pendente |
| Dashboard métricas | Total usuários, sites, posts, page views | ⏳ Pendente |
| Lista de usuários | Tabela com busca e paginação | ⏳ Pendente |
| Lista de sites | Tabela com status e links | ⏳ Pendente |

### Fase 5.2 - Operacional

| Item | Descrição | Status |
|------|-----------|--------|
| Detalhes do usuário | Página `/admin/usuarios/[id]` | ⏳ Pendente |
| Suspender usuário | Botão + motivo + log | ⏳ Pendente |
| Detalhes do site | Página `/admin/sites/[id]` | ⏳ Pendente |
| Forçar despublicação | Tirar site do ar | ⏳ Pendente |
| Logs de auditoria | Histórico de ações admin | ⏳ Pendente |

### Fase 5.3 - Avançado

| Item | Descrição | Status |
|------|-----------|--------|
| RBAC completo | admin, super_admin, support, finance | ⏳ Pendente |
| Impersonar usuário | Login como usuário para debug | ⏳ Pendente |
| Analytics agregado | Métricas totais da plataforma | ⏳ Pendente |
| Exportar dados | CSV de usuários/sites | ⏳ Pendente |
| Broadcast email | Enviar para todos usuários | ⏳ Pendente |
| Feature flags | Toggle de funcionalidades | ⏳ Pendente |

---

## 💬 Fase 6: Sistema de Feedback

> Permite que psicólogos reportem bugs, sugestões, críticas e elogios.

### Fase 6.1 - Essencial

| Item | Descrição | Status |
|------|-----------|--------|
| Tabela user_feedback | Migration com tipos, status, etc | ⏳ Pendente |
| Widget flutuante | Botão fixo no canto inferior do dashboard | ⏳ Pendente |
| Modal de feedback | Formulário com tipo, título, descrição | ⏳ Pendente |
| Upload de screenshot | Anexar imagem do problema | ⏳ Pendente |
| Auto-detect info | Navegador, OS, página atual | ⏳ Pendente |
| Página /dashboard/feedback | Histórico de feedbacks enviados | ⏳ Pendente |

### Fase 6.2 - Integração Admin

| Item | Descrição | Status |
|------|-----------|--------|
| Lista no admin | `/admin/feedbacks` com filtros | ⏳ Pendente |
| Mudar status | Aberto → Em progresso → Resolvido | ⏳ Pendente |
| Notas internas | Admin adiciona comentários | ⏳ Pendente |
| Métricas | Quantos bugs, sugestões, etc | ⏳ Pendente |

### Fase 6.3 - Avançado

| Item | Descrição | Status |
|------|-----------|--------|
| Votação em sugestões | Usuários votam em features desejadas | ⏳ Pendente |
| Roadmap público | Página mostrando o que está sendo desenvolvido | ⏳ Pendente |
| Changelog | Notificar quando algo é implementado | ⏳ Pendente |
| NPS Score | Pesquisa de satisfação periódica (1-10) | ⏳ Pendente |
| Feedback anônimo | Opção de enviar sem identificação | ⏳ Pendente |
| Responder usuário | Admin responde e usuário recebe email | ⏳ Pendente |

### Tipos de Feedback

| Tipo | Ícone | Descrição |
|------|-------|-----------|
| 🐛 Bug | Vermelho | Erro ou problema técnico |
| 💡 Sugestão | Amarelo | Ideia de nova funcionalidade |
| ⭐ Elogio | Verde | Feedback positivo |
| 😕 Crítica | Cinza | Insatisfação com algo |
| ❓ Dúvida | Azul | Pergunta sobre uso |

---

## 📧 Configurações Supabase Pendentes

> Configurar no [Supabase Dashboard](https://supabase.com/dashboard) → Auth → Email Templates

| Email | Descrição | Status |
|-------|-----------|--------|
| Confirmação de email | Traduzir + layout HTML | ⏳ Pendente |
| Reset de senha | Traduzir + layout HTML | ⏳ Pendente |
| Magic link | Traduzir + layout HTML | ⏳ Pendente |
| Mudança de email | Traduzir + layout HTML | ⏳ Pendente |

---

## ⏳ Futuro (Pós-MVP)

### Fase 7 - Monetização (PRIORIDADE PRÉ-LANÇAMENTO)

> **Gateway:** Mercado Pago | **Básico:** R$49/mês | **Pro:** R$79/mês

| Item | Descrição | Status |
|------|-----------|--------|
| Arquivo de planos | Constantes e helpers | ⏳ Pendente |
| Checkout Mercado Pago | Pix, Boleto, Cartão | ⏳ Pendente |
| Webhooks | Atualização de status | ⏳ Pendente |
| Restrições por plano | Verificar features pagas | ⏳ Pendente |
| UI de upgrade | Modal incentivando upgrade | ⏳ Pendente |
| Gestão de assinaturas | Ver/cancelar no dashboard | ⏳ Pendente |
| Cupons de desconto | Aplicar desconto | ⏳ Pendente |

### Features Premium (por Plano)

| Recurso | Gratuito | Básico (R$49) | Pro (R$79) |
|---------|----------|---------------|------------|
| Site + subdomínio | ✅ | ✅ | ✅ |
| Domínio próprio | ❌ | ✅ | ✅ |
| Blog | ⚠️ 3 posts | ✅ Ilimitado | ✅ Ilimitado |
| Estatísticas | ❌ | ✅ | ✅ |
| Remover "by PsicoSites" | ❌ | ❌ | ✅ |
| Fontes premium | ❌ | ✅ | ✅ |
| Vídeo de apresentação | ❌ | ✅ | ✅ |
| Google Analytics próprio | ❌ | ✅ | ✅ |
| Export estatísticas CSV | ❌ | ❌ | ✅ |
| Agendamento de posts | ❌ | ❌ | ✅ |
| Múltiplos idiomas | ❌ | ❌ | ✅ |
| Suporte prioritário | ❌ | ❌ | ✅ |

### Fase 8 - Beta Program

> Documentação completa: [BETA_PROGRAM.md](./BETA_PROGRAM.md)

| Item | Descrição | Status |
|------|-----------|--------|
| Duração | 3 meses Pro grátis | ⏳ Pendente |
| Quantidade | 30-50 psicólogos | ⏳ Pendente |
| Formulário inscrição | Google Forms / Typeform | ⏳ Pendente |
| Link com parâmetro | `/cadastro?beta=CODIGO` | ⏳ Pendente |
| Grupo WhatsApp | Canal de suporte e feedback | ⏳ Pendente |
| Coleta de depoimentos | Mês 3 | ⏳ Pendente |
| Desconto pós-beta | 30% vitalício para conversão | ⏳ Pendente |

### Fase 9 - Diferenciação

#### 🌐 Domínio Personalizado
| Etapa | Descrição |
|-------|-----------|
| Verificação | Usuário informa domínio |
| Tutorial | Instruções por registrador |
| Propagação | Verificação automática |
| SSL | Certificado via Vercel |

#### 🎨 Sistema de Templates
| Template | Descrição |
|----------|-----------|
| Clássico | Layout atual |
| Moderno | Gradientes, ousado |
| Minimalista | Clean, muito branco |
| *Marketplace* | Templates por especialidade |

### Fase 7 - Expansão

#### 📅 Módulo de Agenda
> **Nota:** Será implementado em fase futura.

- Calendário visual
- Agendamento online
- Lembretes WhatsApp
- Integração Google Calendar
- Horários disponíveis

#### 🔄 Integrações Externas
| Prioridade | Integração |
|------------|------------|
| Alta | Google Meu Negócio |
| Alta | Calendly |
| Alta | WhatsApp Business API |
| Média | Docplanner |
| Futura | Sanity.io (CMS) |

### Fase 8 - Premium

#### 💬 Teleconsulta
- Videochamada (Jitsi/Daily.co)
- Sala de espera
- Chat durante consulta

#### 📧 Email Marketing
- Lista de contatos
- Templates de email
- Campanhas e automações

#### 🤖 AI Features
| Feature | Ética |
|---------|-------|
| Gerador de bio | ✅ OK |
| Sugestões de posts | ✅ OK |
| Chatbot no site | ⚠️ Cuidado |
| Resumo de consulta | ❌ Não implementar |

#### 🔐 Compliance CFP
- Validação CRP via API
- Selo de verificação
- Termos éticos
- LGPD compliance

### Fase 9 - Internacionalização

| Funcionalidade | Descrição |
|----------------|-----------|
| Português de Portugal | Suporte pt-PT |
| Espanhol | Para psicólogos latam |
| Moeda configurável | BRL, EUR, USD |

---

## 🎯 Critérios de Priorização

1. **Valor para o psicólogo** - Features que geram captação de pacientes
2. **Receita** - Monetização sustentável
3. **Diferenciação** - Vantagem competitiva
4. **Simplicidade** - Evitar feature creep
5. **Compliance ético** - Prioridade máxima

---

## 📦 Backlog (Ideias Futuras)

> Funcionalidades interessantes sem prioridade definida

### 🎮 Gamificação

| Item | Descrição | Status |
|------|-----------|--------|
| Badges de conquista | "Primeiro artigo", "100 visitantes", etc | 📋 Backlog |
| Barra de progresso | Motivar completar 100% do perfil | 📋 Backlog |
| Notificações de marcos | "Você teve 500 visitas este mês!" | 📋 Backlog |

### 📲 Marketing e Compartilhamento

| Item | Descrição | Status |
|------|-----------|--------|
| QR Code do site | Gerar para cartão de visita | 📋 Backlog |
| Link WhatsApp personalizado | Com mensagem pré-preenchida | 📋 Backlog |
| Botões de compartilhar | Compartilhar artigos nas redes | 📋 Backlog |
| Cards para redes sociais | Preview bonito ao compartilhar | 📋 Backlog |

### 🔐 Segurança

| Item | Descrição | Status |
|------|-----------|--------|
| 2FA | Autenticação dois fatores | 📋 Backlog |
| Histórico de logins | Ver onde/quando acessou | 📋 Backlog |
| Logout de todos dispositivos | Encerrar todas as sessões | 📋 Backlog |

### ♿ Acessibilidade

| Item | Descrição | Status |
|------|-----------|--------|
| Verificador WCAG | Checar se site é acessível | 📋 Backlog |
| Alto contraste | Opção para visitantes | 📋 Backlog |
| Leitor de tela otimizado | ARIA labels completos | 📋 Backlog |

### 🔄 Backup e Versionamento

| Item | Descrição | Status |
|------|-----------|--------|
| Backup automático | Salvar versões do conteúdo | 📋 Backlog |
| Restaurar versão anterior | Voltar a um estado prévio | 📋 Backlog |
| Duplicar site | Usar como template | 📋 Backlog |

### 🛠️ Infraestrutura Avançada

| Item | Descrição | Status |
|------|-----------|--------|
| Logs centralizados | Debugging avançado | 📋 Backlog |
| APM (Application Performance) | Métricas de performance | 📋 Backlog |
| Disaster recovery customizado | Backup além do Supabase | 📋 Backlog |
| Health checks avançados | Endpoints de status | 📋 Backlog |
| Auto-scaling customizado | Além do Vercel padrão | 📋 Backlog |

### 📊 Relatórios

| Item | Descrição | Status |
|------|-----------|--------|
| Relatório mensal por email | Resumo de métricas automático | 📋 Backlog |
| Performance (Lighthouse) | Score de velocidade | 📋 Backlog |
| Comparativo com média | "Seu site está acima da média" | 📋 Backlog |

### 🤝 Programa de Indicação

| Item | Descrição | Status |
|------|-----------|--------|
| Link de indicação | Psicólogo indica colegas | 📋 Backlog |
| Recompensas | Desconto ou mês grátis ao indicar | 📋 Backlog |
| Dashboard de indicações | Ver quem indicou | 📋 Backlog |

### 🌐 Outros

| Item | Descrição | Status |
|------|-----------|--------|
| Múltiplos idiomas no site | Português + Espanhol + Inglês | 📋 Backlog |
| Widget de agendamento | Embed do Calendly/Google | 📋 Backlog |
| Google Meu Negócio | Sincronizar dados | 📋 Backlog |
| Modo "Em férias" | Aviso temporário no site | 📋 Backlog |

### 🏥 Conteúdo Adicional para Sites

| Item | Descrição | Status |
|------|-----------|--------|
| Galeria de fotos | Fotos do consultório | 📋 Backlog |
| Área de recursos | PDFs, exercícios para download | 📋 Backlog |
| Convênios aceitos | Lista de planos de saúde | 📋 Backlog |
| Parceiros | Clínicas, empresas parceiras | 📋 Backlog |
| Newsletter | Captura de emails dos visitantes | 📋 Backlog |
| Podcast/Mídia | Participações em podcasts, TV | 📋 Backlog |
| E-books | Download de materiais gratuitos | 📋 Backlog |
| Cursos online | Acesso a cursos gravados | 📋 Backlog |
| Portal do paciente | Área logada para pacientes | 📋 Backlog |
| Agendamento online nativo | Calendário para marcar sessão | 📋 Backlog |

---

## 📝 Notas Importantes

- Priorizar feedback de usuários beta
- Manter compliance com CFP/LGPD
- AI nunca para conteúdo clínico
- Transparência sobre uso de dados

---

## 📋 Checklist de Testes (Antes de cada deploy)

- [ ] `npm run build` passa
- [ ] Lighthouse score > 90
- [ ] Fluxos principais funcionando
- [ ] Mobile responsivo
- [ ] Mensagens em português
