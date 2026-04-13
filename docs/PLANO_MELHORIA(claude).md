# Plano de Melhoria — FINANCEIRO INOVA

## Context

O projeto é um sistema de gestão financeira/operacional (React 19 + Node/Express + SQLite) com ~90% de features implementadas, mas com bugs críticos de runtime, inconsistências arquiteturais e falhas de segurança que impedem uso em produção. O foco desta sprint é **bugs críticos primeiro**, mantendo SQLite local e adicionando testes automatizados.

---

## Fase 1 — Bugs Críticos de Runtime (bloqueadores imediatos)

### 1.1 `GlobalModals.tsx` — 3 bugs críticos

**Arquivo:** `src/components/layout/GlobalModals.tsx`

**Bug A — Linha ~136:** `warningType` recebe `'duplicate'` que não existe no tipo
```ts
// Errado
setWarningType('duplicate');
// Correto — adicionar 'duplicate' ao union type em useModalStore.ts
```
**Fix:** Adicionar `'duplicate'` ao union type em `src/store/useModalStore.ts`.

**Bug B — Linha ~121:** Propriedade `adminPassword` não existe em `AppSettings`
```ts
// Errado
if (passwordInput === settings.adminPassword)
// Correto
if (passwordInput === settings.settingsPassword)
```

**Bug C — Linha ~174:** `clientPaymentToDelete` é `number`, não `{ id: number }`
```ts
// Errado
await deleteClientPaymentAPI(clientPaymentToDelete.id);
// Correto
await deleteClientPaymentAPI(clientPaymentToDelete);
```

---

### 1.2 `App.tsx` — Referência indefinida

**Arquivo:** `src/App.tsx`, linha ~113
`printBlankForm(settings)` é chamada mas nunca importada.
**Fix:** Importar de `src/lib/printUtils.ts` ou implementar a função se não existir.

**Arquivo:** `src/App.tsx`, linha ~159
`logout()` navega para `/dashboard` em vez de `/login`.
**Fix:** Navegar para `/login` após logout + limpar estado de auth no Zustand.

---

### 1.3 Consolidar dois clientes de API (axios vs fetch)

**Problema:** Dois módulos paralelos causam bugs sutis de resposta e error handling:
- `src/lib/api.ts` — axios com interceptors (usado por `useTransactions`, `useCustomers`, etc.)
- `src/services/api.ts` — fetch puro, retorna JSON cru (usado por `useClientPayments`)

**Fix:**
- Migrar `useClientPayments.ts` para usar `src/lib/api.ts` (axios)
- Remover `src/services/api.ts` após migração
- Corrigir o `limit` default inconsistente (20 vs 10) em `useClientPayments.ts` linha ~89

---

## Fase 2 — Segurança

### 2.1 Hashing de senhas com bcrypt

**Arquivo:** `server.ts`

- Instalar `bcryptjs` (TypeScript-friendly)
- Linha ~357: Hash da senha padrão `'admin'` antes de inserir no banco
- Endpoint POST `/api/login`: comparar com `bcrypt.compare()` em vez de igualdade direta
- Endpoint de atualização de senha (Settings): hash antes de salvar
- Adicionar migração para hashear senhas existentes no banco

```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

### 2.2 Remover senhas hardcoded do código-fonte

| Arquivo | Linha | Problema | Fix |
|---|---|---|---|
| `server.ts` | ~141 | `DEFAULT '1234'` | Mudar default para vazio |
| `server.ts` | ~357 | `admin/admin` hardcoded | Mover para `.env` |
| `src/store/useSettingsStore.ts` | ~28 | `settingsPassword: '1234'` | Remover default |

### 2.3 Remover logs de dados sensíveis

**Arquivo:** `server.ts`, linha ~485
Remover `console.log('[TRANSACTION POST] Received body:', req.body)` e similares.
Usar `logger.ts` já existente com níveis de log adequados.

---

## Fase 3 — Qualidade de Código e Type Safety

### 3.1 Corrigir tipagem fraca

| Arquivo | Linha | Problema | Fix |
|---|---|---|---|
| `src/store/useModalStore.ts` | ~51 | `customerPaymentsWarning: any[]` | Tipar com interface de `types.ts` |
| `src/types.ts` | ~67 | `paymentHistory` como `string` (JSON) | Helper de parse tipado |

### 3.2 URL params em useTransactions

**Arquivo:** `src/hooks/useTransactions.ts`, linha ~36
Substituir concatenação manual de strings por `URLSearchParams`:
```ts
const params = new URLSearchParams();
if (filters.search) params.set('search', filters.search);
// etc.
const url = `/transactions?${params.toString()}`;
```

### 3.3 Logs de produção

- Auditar todos os `console.log` em `src/` (~45 ocorrências)
- Substituir por `logger.ts` com níveis: debug, info, warn, error
- Remover logs de dados de usuário/transação

---

## Fase 4 — Testes Automatizados

**Stack:** Vitest + React Testing Library + MSW (Mock Service Worker)

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom msw @vitest/ui
```

### Escopo de testes prioritários

| Arquivo de Teste | O que testar |
|---|---|
| `useTransactions.test.ts` | Filtragem, paginação, CRUD |
| `useClientPayments.test.ts` | Criação de pagamento, registro de parcela |
| `useCustomers.test.ts` | Detecção de duplicatas (CPF/telefone) |
| `GlobalModals.test.tsx` | Password modal, delete confirmation |
| `utils.test.ts` | Funções de formatação (currency, date) |
| `server.test.ts` | Endpoints críticos do Express |

### Configuração

- `vitest.config.ts` — configurar com jsdom environment
- `src/test/setup.ts` — setup do testing-library
- `src/test/mocks/handlers.ts` — MSW handlers para API

Scripts em `package.json`:
```json
"test": "vitest",
"test:ui": "vitest --ui",
"test:coverage": "vitest run --coverage"
```

---

## Fase 5 — Implementações Faltando

### 5.1 Função `printBlankForm()` — App.tsx
Implementar em `src/lib/printUtils.ts` — formulário em branco de OS para preenchimento manual.

### 5.2 Validação de variáveis de ambiente
Adicionar no topo de `server.ts`:
```ts
const requiredEnvVars = ['PORT'];
requiredEnvVars.forEach(v => {
  if (!process.env[v]) console.warn(`Env var ${v} not set, using default`);
});
```

### 5.3 Limites de tamanho em Base64 de fotos
**Arquivo:** `server.ts` — endpoint POST `/api/service-orders`
Adicionar validação: fotos Base64 não devem exceder 2MB por imagem.

### 5.4 Sistema de atualização (Settings.tsx linha ~78)
Atualmente simulado com `setTimeout`. Opções:
- Remover UI de "Verificar atualizações" (mais simples e honesto)
- Ou implementar via endpoint que retorna versão atual vs versão no `package.json`

---

## Tabela de Arquivos Críticos

| Arquivo | Fase | Tipo de mudança |
|---|---|---|
| `src/components/layout/GlobalModals.tsx` | 1 | Corrigir 3 bugs |
| `src/App.tsx` | 1 | Importar printBlankForm, fix logout |
| `src/store/useModalStore.ts` | 1 + 3 | Adicionar 'duplicate' ao union, tipar any[] |
| `src/hooks/useClientPayments.ts` | 1 | Migrar para axios, fix limit |
| `src/services/api.ts` | 1 | Remover após migração |
| `server.ts` | 2 | bcrypt, remover hardcoded, remover logs sensíveis |
| `src/store/useSettingsStore.ts` | 2 | Remover senha default |
| `src/hooks/useTransactions.ts` | 3 | URLSearchParams |
| `src/types.ts` | 3 | Tipar paymentHistory |
| `src/lib/printUtils.ts` | 5 | Implementar printBlankForm |

---

## Verificação — Como Testar Cada Fase

### Fase 1
- Abrir modal de confirmação de senha → deve aceitar senha correta
- Deletar um pagamento → não deve dar erro de `.id` em number
- Usar filtros em Transações → URL deve ser formada corretamente
- Fazer logout → deve redirecionar para `/login`

### Fase 2
- Login com `admin/admin` deve funcionar após migração de hash
- Alterar senha nas configurações → nova senha deve funcionar no próximo login
- Console do servidor não deve exibir dados de transações

### Fase 4
```bash
npm run test          # rodar todos os testes
npm run test:ui       # Vitest UI no browser
npm run test:coverage # coverage report
```

### Regressão Manual (fluxo completo)
1. Criar cliente
2. Criar OS para esse cliente
3. Registrar pagamento
4. Verificar no dashboard
5. Testar filtros de transação (por tipo, data, categoria)
6. Criar usuário novo nas configurações
