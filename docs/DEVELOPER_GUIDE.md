# Guia do Desenvolvedor - FINANCEIRO INOVA

## 1. Configuração do Ambiente
O projeto utiliza **Vite** para o frontend e **Express** para o backend.

### 1.1 Pré-requisitos
- Node.js 18+
- npm ou yarn

### 1.2 Instalação
```bash
npm install
```

### 1.3 Variáveis de Ambiente
Copie `.env.example` para `.env` e configure:
```bash
JWT_SECRET=sua-chave-secreta-aqui
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

### 1.4 Execução em Desenvolvimento
```bash
npm run dev
```

---

## 2. Padrões de Código

### 2.1 TypeScript
- Use interfaces globais em `src/types.ts`.
- Evite o uso de `any`.
- Tipagem forte em todos os hooks e componentes.

### 2.2 Componentização
- Componentes de UI devem ser puros e reutilizáveis (em `src/components/ui`).
- Lógica complexa deve ser movida para hooks customizados.
- Use `lucide-react` para ícones.
- Use `React.memo` para listas grandes.

### 2.3 Estado Global (Zustand)
- Segmentar o estado em diferentes stores para evitar re-renderizações desnecessárias.
- Exemplo: `useModalStore` apenas para controle de modais.

### 2.4 API Client
- Use `src/lib/api.ts` (axios) para todas as chamadas API.
- Não use `src/services/api.ts` (fetch).
- O interceptor já adiciona o token Authorization automaticamente.

---

## 3. Segurança

### 3.1 Autenticação
- Tokens JWT são armazenados no `localStorage` com chave `token`.
- O interceptor do axios adiciona `Authorization: Bearer <token>` em todas as requisições.
- Ao receber 401, o interceptor redireciona para `/login`.

### 3.2 Middlewares
- `authMiddleware`: Verifica token JWT
- `requireRole(...)`: Verifica se o usuário tem a role necessária

### 3.3 Rate Limiting
- Login: 5 tentativas por IP a cada 15 minutos
- API: 100 requests por minuto por IP

### 3.4 Validação de Input
- Use Zod schemas em `src/schemas/`
- Columns para ORDER BY são validadas via whitelist

---

## 4. Banco de Dados (SQLite)
O banco de dados é o arquivo `finance.db` na raiz do projeto.
Para visualizar os dados localmente, você pode usar ferramentas como **DB Browser for SQLite** ou extensões do VS Code.

### 4.1 Esquema e Migrações
O esquema é definido e inicializado no `server.ts`. Migrações simples são feitas via `ALTER TABLE` no início do servidor.

### 4.2 Schema Prisma
O arquivo `prisma/schema.prisma` define o schema do banco. Para validar:
```bash
npx prisma validate
```

---

## 5. API REST
As rotas da API estão centralizadas no `server.ts` sob o prefixo `/api`.
Todas as rotas de escrita (POST, PUT, DELETE) devem gerar logs de auditoria.

### 5.1 Endpoints de Autenticação
- `POST /api/login` - Login (rate limited)
- `POST /api/auth/logout` - Logout (requer token)
- `GET /api/auth/me` - Usuário atual (requer token)
- `PUT /api/auth/change-password` - Alterar senha (requer token)

### 5.2 Endpoints de Notificação
- `GET /api/notifications` - Lista de notificações (requer token)
- `GET /api/inventory/alerts` - Alertas de estoque (requer token)

---

## 6. Débitos Técnicos e Manutenção
- **Arquivos Grandes:** Evite que componentes ou hooks cresçam demais. Se um arquivo passar de 500 linhas, considere refatorar.
- **Performance:** Use `lazy` loading para páginas e `memo` para componentes pesados se necessário.
- **Acessibilidade:** Garanta que o sistema seja utilizável via teclado e que o redimensionamento de fontes funcione corretamente.

---
**Versão:** 1.1.0
**Data:** Abril de 2026
