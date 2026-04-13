# Guia de Migração - FINANCEIRO INOVA

**Versão:** 1.0  
**Data:** 2026-04-13  
**Status:** Pronto para executar quando necessário

---

## Quando Migrar

Esta migração deve ser considerada quando:

1. Sistema em produção por pelo menos 1 mês sem incidentes
2. Volume de dados justificando PostgreSQL (>10GB ou >1000 users simultâneos)
3. Necessidade de multi-usuário simultâneo real
4. Necessidade de backups point-in-time

**NOTA:** Para a maioria dos casos, SQLite é suficiente e mais simples.

---

## Pré-requisitos

- Node.js 18+
- Conta no Supabase (ou outro provedor PostgreSQL)
- Todos os dados exportados do SQLite

---

## Passo 1: Exportar Dados do SQLite

```bash
# Executar script de exportação
npx tsx scripts/exportSqlite.ts

# Verificar dados exportados
ls -la backups/sqlite-export/
```

Isso criará arquivos JSON para cada tabela:
- users.json
- transactions.json
- customers.json
- client_payments.json
- service_orders.json
- inventory_items.json
- etc.

---

## Passo 2: Criar Projeto no Supabase

1. Acesse https://supabase.com
2. Crie um novo projeto
3. Aguarde o provisionamento
4. Obtenha a connection string

---

## Passo 3: Atualizar Schema Prisma

Edite `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## Passo 4: Configurar Variáveis de Ambiente

```bash
# .env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="your-production-secret"
```

---

## Passo 5: Gerar Migration

```bash
# Validar schema
npx prisma validate

# Gerar e aplicar migration
npx prisma migrate dev --name add_postgresql
```

---

## Passo 6: Importar Dados

```bash
# Executar script de importação
npx tsx scripts/importPostgres.ts
```

Ou importe manualmente os JSONs via interface do Supabase.

---

## Passo 7: Testar

```bash
# Iniciar em modo desenvolvimento
npm run dev

# Testar:
# - Login
# - CRUD de todas as entidades
# - Permissões
# - Auditoria
```

---

## Passo 8: Deploy

Configure as variáveis de ambiente no provedor de hosting:
- DATABASE_URL
- JWT_SECRET
- FRONTEND_URL

```bash
# Build para produção
npm run build

# Deploy (exemplo com Vercel, Netlify, etc.)
```

---

## Rollback

Se algo der errado:

1. Restaurar backup do SQLite
2. Manter provider = "sqlite"
3. Corrigir problemas
4. Tentar novamente

---

## Diferenças SQLite vs PostgreSQL

| Aspecto | SQLite | PostgreSQL |
|---------|--------|------------|
| Concorrência | Limitada | Alta |
| Backup | Arquivo | Point-in-time |
| Escalabilidade | Local | Horizontal |
| Setup | Zero config | Requer servidor |

---

*Última atualização: 2026-04-13*
