# Supabase - Guia de Comandos

Este documento contém os comandos essenciais para trabalhar com Supabase no PsiBuilder.

## 🚀 Setup Inicial

```bash
# Iniciar Supabase local
npx supabase start

# Parar Supabase local
npx supabase stop
```

## 📦 Migrações

```bash
# Criar nova migração
npx supabase migration new nome_da_migracao

# Aplicar migrações pendentes (local)
npx supabase db push --local

# Resetar banco local (aplica todas migrações + seed)
npx supabase db reset

# Ver status das migrações
npx supabase migration list
```

## 🔧 Tipos TypeScript

```bash
# Gerar tipos do banco local
npx supabase gen types typescript --local > src/types/supabase.ts

# Gerar tipos do banco de produção
npx supabase gen types typescript --project-id SEU_PROJECT_ID > src/types/supabase.ts
```

## 🌐 Produção

### Linkar com projeto Supabase
```bash
npx supabase link --project-ref SEU_PROJECT_REF
```

### Deploy de migrações para produção
```bash
npx supabase db push
```

### Verificar diff entre local e remoto
```bash
npx supabase db diff
```

## 📁 Estrutura de Pastas

```
supabase/
├── config.toml              # Configuração do projeto
├── migrations/              # Migrações versionadas
│   ├── 20241201000000_initial_schema.sql
│   ├── 20241205000000_analytics_blog.sql
│   └── 20241210000000_faqs_testimonials.sql
├── seed.sql                 # Dados iniciais (dev)
└── functions/               # Edge Functions (futuro)

src/types/
└── supabase.ts              # Tipos gerados automaticamente
```

## 🔄 Fluxo de Trabalho Recomendado

1. **Desenvolvimento Local**
   ```bash
   npx supabase start
   npm run dev
   ```

2. **Criar Nova Migração**
   ```bash
   npx supabase migration new adicionar_nova_tabela
   # Edite o arquivo criado em supabase/migrations/
   npx supabase db reset  # Testa localmente
   ```

3. **Atualizar Tipos**
   ```bash
   npx supabase gen types typescript --local > src/types/supabase.ts
   ```

4. **Deploy para Produção**
   ```bash
   npx supabase db push
   npx supabase gen types typescript --project-id SEU_ID > src/types/supabase.ts
   ```

## ⚠️ Dicas Importantes

- **Nunca edite diretamente o banco de produção** - sempre use migrações
- **Sempre gere tipos após mudanças** no schema
- **Teste migrações localmente** antes do deploy
- **Faça backup** antes de migrações destrutivas em produção

## 🔗 URLs Locais

- Supabase Studio: http://127.0.0.1:54323
- API: http://127.0.0.1:54321
- Database: postgresql://postgres:postgres@127.0.0.1:54322/postgres
- Inbucket (emails): http://127.0.0.1:54324
