Com base em todo o planeamento e nos *prompts* de design que definimos, a plataforma **PsicoSites** terá aproximadamente **23 ecrãs (telas) principais** para desenvolver.

Aqui está a lista completa organizada por contexto para facilitar o seu controlo de desenvolvimento:

### 1. Institucional & Acesso (5 Telas)
*São as páginas públicas para vender o seu SaaS.*
1.  **Landing Page:** A página de vendas do PsicoSites.
2.  **Página de Preços:** Comparativo de planos (Gratuito vs Pro).
3.  **Login:** Ecrã de entrada (Supabase Auth).
4.  **Cadastro:** Ecrã de registo de nova conta.
5.  **Legal:** Página genérica para Termos de Uso e Política de Privacidade.

### 2. Painel do Psicólogo (10 Telas)
*A área restrita onde o cliente trabalha.*
6.  **Onboarding (Wizard):** O passo-a-passo inicial gamificado (Nome > Foto > Cor > Especialidades).
7.  **Dashboard (Home):** Visão geral com métricas e atalhos.
8.  **Editor de Site:** Configuração de perfil, tema e visualização (preview).
9.  **Gestor de Blog:** Listagem dos artigos criados pelo psicólogo.
10. **Biblioteca de Conteúdo:** Galeria de textos prontos para copiar/usar.
11. **Planos e Assinatura:** Área para gerir a subscrição e upgrade de plano.
12. **Wizard de Domínio:** Tutorial guiado de configuração de DNS.
13. **Área de Cobrança:** Faturas, troca de cartão, histórico de pagamentos.
14. **Minha Conta:** Configurações de e-mail, senha e dados de faturação.
15. **Suporte:** Área de ajuda, tutoriais (incluindo Google Analytics).

### 3. Site do Cliente/Psicólogo (4 Telas)
*O produto final que é gerado automaticamente.*
16. **Home do Site:** O site principal (One-page ou Multi-page) com Hero, Sobre, Serviços, Contato.
17. **Blog (Listagem):** Página que mostra todos os artigos publicados.
18. **Post (Leitura):** A página interna de um artigo específico.
19. **Erro 404:** Página personalizada para links quebrados ou sites desativados.

### 4. Backoffice / Super Admin (4 Telas)
*A sua área de gestão do negócio.*
20. **Dashboard Admin:** Métricas financeiras (MRR) e crescimento.
21. **Gestão de Usuários:** Lista de todos os clientes e status.
22. **Gestor da Biblioteca:** Onde você adiciona os textos modelo para todos verem.
23. **Monitor de Domínios:** Lista técnica para verificação de DNS.

---

**Total:** **23 Telas Principais.**

*Nota:* Além destas telas, existem **Estados de UI** (Modais, Loading, Empty States) que são componentes menores dentro dessas páginas, mas o esforço de design e *frontend* deve ser estimado com base nestas 23 vistas.