# 💰 Definição de Planos - PsicoSites

## Resumo

| Plano | Preço | Público |
|-------|-------|---------|
| **Grátis** | R$0 | Psicólogos começando online |
| **Pro** | R$47/mês | Profissionais que querem se destacar |

---

## Plano Grátis (R$0)

### ✅ Incluído

| Categoria | Feature | Limite |
|-----------|---------|--------|
| **Site** | Todas as seções (Hero, Sobre, FAQ, Contato, etc.) | ✅ |
| **Domínio** | Subdomínio psicosites.com.br | joao.psicosites.com.br |
| **Cores** | Azul, Verde, Roxo | 3 opções |
| **Fontes** | Playfair + Elegante, Montserrat + Moderna | 2 presets |
| **Especialidades** | Todas | Ilimitadas |
| **Depoimentos** | Seção de depoimentos | Até 3 |
| **Blog** | Artigos com SEO | Até 3 posts |
| **Extras** | Horários, Metodologias, Público-alvo, Certificações, Preços | ✅ |
| **Contato** | WhatsApp + Instagram flutuante | ✅ |
| **Estatísticas** | Views e cliques | Básicas |

### ❌ Limitações

| Limitação | Descrição |
|-----------|-----------|
| Badge destacado | "✨ Feito com PsicoSites" visível com fundo colorido |
| Sem domínio próprio | Apenas subdomínio |
| Sem vídeo no Hero | Só imagem |
| Cores limitadas | 3 opções (Azul, Verde, Roxo) |
| Fontes limitadas | 2 presets |

---

## Plano Pro (R$47/mês)

### ✅ TUDO do Grátis +

| Categoria | Feature | Detalhe |
|-----------|---------|---------|
| **Domínio** | Domínio próprio | seunome.com.br |
| **Cores** | 8 opções premium | +Rosa, Terracota, Teal, Bordô, Grafite |
| **Fontes** | 5+ presets | Todas as opções |
| **Vídeo** | Vídeo no Hero | YouTube/Vimeo embed |
| **Depoimentos** | Ilimitados | Sem limite |
| **Blog** | Ilimitado | Sem limite de posts |
| **Badge** | Discreto | Texto pequeno, cor neutra |
| **Estatísticas** | Avançadas | Scroll depth, dispositivos, horário de pico |
| **Suporte** | Prioritário | Resposta em 24h |

---

## Cores Disponíveis

### Grátis (3 cores)
| Nome | Hex | Sensação |
|------|-----|----------|
| Azul Índigo | #6366f1 | Confiança, profissionalismo |
| Verde Esmeralda | #10b981 | Calma, saúde mental |
| Roxo Violeta | #8b5cf6 | Criatividade, equilíbrio |

### Pro (+ 5 cores)
| Nome | Hex | Sensação |
|------|-----|----------|
| Rosa Blush | #ec4899 | Acolhimento, feminino |
| Terracota | #f97316 | Aconchego, moderno |
| Teal | #14b8a6 | Sofisticação, calma |
| Bordô | #be123c | Elegância, intensidade |
| Grafite | #475569 | Minimalista, sério |

---

## Badge "Feito com PsicoSites"

### Grátis (Destacado)
```
┌─────────────────────────────────┐
│  ✨ Feito com PsicoSites        │
└─────────────────────────────────┘
- Fundo com cor primária (20% opacidade)
- Ícone de estrela
- Fonte maior (text-sm)
- Link clicável
```

### Pro (Discreto)
```
Feito com PsicoSites
- Sem fundo
- Sem ícone
- Fonte menor (text-xs)
- Cor cinza claro
- Link clicável
```

---

## Implementação no Código

### Verificações necessárias:
```typescript
// Verificar se é Pro
const isPro = subscription?.plan === 'pro';

// Cores
const availableColors = isPro ? ALL_COLORS : FREE_COLORS;

// Fontes
const availableFonts = isPro ? ALL_FONTS : FREE_FONTS;

// Blog
const canCreatePost = isPro || blogPosts.length < 3;

// Depoimentos
const canAddTestimonial = isPro || testimonials.length < 3;

// Vídeo
const canAddVideo = isPro;

// Domínio
const canUseCustomDomain = isPro;
```

---

## Arquivos a Modificar

1. `src/lib/constants.ts` - Definir PLANS, FREE_COLORS, PRO_COLORS
2. `src/components/landing/pricing-section.tsx` - Atualizar UI
3. `src/app/dashboard/planos/` - Simplificar página
4. `src/components/site/site-footer.tsx` - Badge dinâmico
5. `src/app/dashboard/site/` - Verificações de limite
