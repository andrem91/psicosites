# 🔄 Plano de Rebranding: PsiBuilder → PsicoSites

**Data:** Janeiro/2026  
**Novo domínio:** psicosites.com.br

---

## 📊 Resumo

| Item | Quantidade |
|------|------------|
| Arquivos a alterar | ~25 |
| Referências encontradas | 100+ |
| Tempo estimado | 1-2 horas |

---

## 📝 Mudanças Principais

| De | Para |
|----|------|
| PsiBuilder | PsicoSites |
| psibuilder.com.br | psicosites.com.br |
| psibuilder.vercel.app | psicosites.vercel.app |
| contato@psibuilder.com.br | contato@psicosites.com.br |
| suporte@psibuilder.com.br | contato@psicosites.com.br |
| privacidade@psibuilder.com.br | contato@psicosites.com.br |

> **Nota:** Todos os emails centralizados em `contato@psicosites.com.br`

---

## 📁 Arquivos a Atualizar

### Configuração
- [ ] `package.json` - nome do projeto
- [ ] `README.md` - título e descrição
- [ ] `.env.example` - URLs de exemplo

### Middleware e Rotas
- [ ] `src/middleware.ts` - domínios permitidos

### Layout e Metadata
- [ ] `src/app/layout.tsx` - metadata global
- [ ] `src/app/page.tsx` - landing page metadata

### Landing Page
- [ ] `src/components/landing/navbar.tsx` - logo/nome
- [ ] `src/components/landing/hero-section.tsx` - textos
- [ ] `src/components/landing/sections.tsx` - textos
- [ ] `src/components/landing/more-sections.tsx` - exemplos
- [ ] `src/components/landing/pricing-section.tsx` - planos
- [ ] `src/components/landing/testimonials-section.tsx` - depoimentos
- [ ] `src/components/landing/faq-section.tsx` - FAQs
- [ ] `src/components/landing/footer.tsx` - rodapé

### Dashboard
- [ ] `src/components/dashboard/sidebar.tsx` - logo
- [ ] `src/app/dashboard/page.tsx` - metadata
- [ ] `src/app/dashboard/site/page.tsx` - metadata
- [ ] `src/app/dashboard/site/site-editor.tsx` - subdomínios
- [ ] `src/app/dashboard/planos/plans-page-client.tsx` - planos
- [ ] `src/app/dashboard/suporte/page.tsx` - emails
- [ ] `src/app/dashboard/onboarding/page.tsx` - metadata

### Site Público
- [ ] `src/components/site/site-footer.tsx` - crédito
- [ ] `src/app/site/[subdomain]/not-found.tsx` - link

### Páginas Legais
- [ ] `src/app/termos/page.tsx` - termos de uso
- [ ] `src/app/privacidade/page.tsx` - privacidade
- [ ] `src/app/cookies/page.tsx` - cookies

### Documentação
- [ ] `doc/ROADMAP.md` - referências
- [ ] `doc/ADMIN_PLAN.md` - referências
- [ ] `doc/PRE_LAUNCH_PLAN.md` - referências
- [ ] `supabase/SUPABASE_GUIDE.md` - referências
- [ ] `supabase/schema.sql` - comentários
- [ ] `supabase/migrations/*.sql` - comentários

### Tipos
- [ ] `src/types/specialty.ts` - comentário
- [ ] `src/lib/constants.ts` - comentário

---

## ✅ Checklist de Execução

1. [ ] Fazer backup/commit antes
2. [ ] Substituir todas as referências
3. [ ] Testar build local
4. [ ] Verificar landing page
5. [ ] Verificar dashboard
6. [ ] Verificar site público
7. [ ] Atualizar Vercel (domínio)
8. [ ] Registrar domínio psicosites.com.br
9. [ ] Commit final

---

## 🚀 Comandos para Executar

Após as alterações:
```bash
npm run build
npm run dev
# Testar todas as páginas
```

---

## ⚠️ Atenção

- Atualizar variáveis de ambiente no Vercel
- Configurar novo domínio no Vercel
- Atualizar DNS após registro do domínio
