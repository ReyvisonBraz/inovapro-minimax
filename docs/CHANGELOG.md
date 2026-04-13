# Changelog - FINANCEIRO INOVA

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-04-13

### Segurança
- ✅ Autenticação JWT implementada (token com expiração de 7 dias)
- ✅ Senhas com bcrypt (hash, salt rounds = 10)
- ✅ Roles e permissões (owner/manager/employee)
- ✅ Rate limiting no login (5 tentativas/15min por IP)
- ✅ Rate limiting na API (100 requests/min por IP)
- ✅ CORS configurado para FRONTEND_URL
- ✅ SQL injection prevenido via whitelist de colunas
- ✅ Middlewares de autenticação e autorização implementados

### Código
- ✅ API client unificado com axios (`src/lib/api.ts`)
- ✅ Interceptors de token e 401 funcionando
- ✅ Login atualizado para receber e armazenar token
- ✅ useAuthStore atualizado para persistência com token
- ✅ Memoização de listas (TransactionList, CustomerList, ServiceOrderList)
- ✅ Schemas Zod criados: inventorySchema, settingsSchema, brandSchema, modelSchema, equipmentTypeSchema

### Banco
- ✅ Prisma schema atualizado para SQLite
- ✅ Colunas faltantes adicionadas (paymentId, saleId em transactions, etc.)
- ✅ Dados de teste limpos (cliente com CPF inválido removido)
- ✅ Documentação do banco criada (docs/DATABASE.md)

### Frontend
- ✅ Função exportToCSV criada (`src/lib/export.ts`)
- ✅ Endpoint `/api/inventory/alerts` implementado
- ✅ Endpoint `/api/notifications` implementado

### Integrações
- ✅ SendPulse/WhatsApp mantido (manual por enquanto)
- ✅ Gemini AI removido (dependência `@google/genai` desinstalada)

### Documentação
- ✅ docs/ARCHITECTURE.md atualizado com segurança
- ✅ docs/DEVELOPER_GUIDE.md atualizado com setup de segurança
- ✅ docs/DATABASE.md criado

## [1.0.0] - 2026-04-13

### Added
- Sistema financeiro completo (FINANCEIRO INOVA)
- Dashboard com métricas
- Gestão de transações (receitas/despesas)
- Gestão de clientes e pagamentos
- Ordens de serviço
- Controle de estoque
- Sistema de usuários com roles
- Interface responsiva com tema escuro
