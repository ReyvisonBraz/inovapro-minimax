# Decisões de Arquitetura - FINANCEIRO INOVA

Este documento registra as decisões arquiteturais importantes tomadas durante o desenvolvimento do projeto.

---

## Autenticação: JWT vs Sessions

**Decisão:** JWT (JSON Web Tokens)

**Rationale:**
- Stateless é melhor para APIs REST
- Mais fácil de escalar horizontalmente
- Suporte nativo em Supabase/futuro PostgreSQL
- Menos necessidade de gerenciamento de sessão no servidor

**Alternativa considerada:** Sessions (express-session)
- Requer storage de sessão (Redis/memória)
- Mais complexo para escalar
- Menos compatível com arquitetura stateless

---

## Hash de Senhas: bcrypt vs argon2

**Decisão:** bcrypt (via bcryptjs)

**Rationale:**
- Suporte nativo em Node.js (bcryptjs)
- Suficiente para maioria dos casos de uso
- Argon2 mais seguro mas mais complexo de configurar
- Implementação simples e testada

**Nota:** Em produção futura, considerar migrar para argon2 se requisitos de segurança aumentarem.

---

## API Client: axios vs fetch

**Decisão:** axios

**Rationale:**
- Interceptors nativos para request/response
- Transformação de dados mais fácil
- Melhor error handling
- Compatível com TypeScript

**Alternativa considerada:** fetch (nativo)
- Não tem interceptors nativos
- Requer mais código para funcionalidades básicas
- API menos intuitiva para casos complexos

---

## Estado Global: Zustand

**Decisão:** Zustand

**Rationale:**
- API simples e minimalista
- Não requer wrappers como Provider
- Excelente performance
- Suporte a middleware/hooks
- Ágil para TypeScript

**Alternativa considerada:** Redux
- Boilerplate excessivo
- Curva de aprendizado maior
- Desempenho inferior sem selectors otimizados

---

## Banco de Dados: SQLite vs PostgreSQL

**Decisão:** SQLite (atualmente), preparado para PostgreSQL (futuro)

**Rationale (SQLite):**
- Zero configuração
- Portátil (arquivo único)
- Excelente para desenvolvimento local
- Menos overhead operacional

**Rationale (Preparação para PostgreSQL):**
- Schema Prisma já configurado paraprovider = "postgresql"
- Compatibilidade SQL mantida
- Queries testadas funcionam em ambos
- Migração documentada em FASE 8

---

## Rate Limiting

**Decisão:** express-rate-limit

**Rationale:**
- Implementação simples
- Não requer storage externo
- Suficiente para casos de uso local/produção pequena
- Configuração granular por rota

**Limites definidos:**
- Login: 5 tentativas por IP em 15 minutos
- API geral: 100 requests por minuto por IP

---

## Validação de Input

**Decisão:** Zod

**Rationale:**
- Type-safe com TypeScript
- Schema validation robusto
- Integração com react-hook-form
- Performance boa

**Áreas de uso:**
- Server.ts: Zod schemas para todas as requisições
- Frontend: Schemas em `src/schemas/` para validação de formulários

---

## SQL Injection Prevention

**Decisão:** Whitelist de colunas

**Rationale:**
- approach simples e efetivo
- Não requer ORM completo
- Mantém performance do SQLite
- Validado para ORDER BY e sort parameters

---

## SendPulse/WhatsApp

**Decisão:** Manter código, envio manual

**Rationale:**
- Usuário prefere manter manual por enquanto
- Redirecionamento para web/app do WhatsApp
- Futuro: implementação automática via API SendPulse

---

## Gemini AI

**Decisão:** Removido

**Rationale:**
- Não está em uso atualmente
- Dependência não necessária
- Reduz surface area de segurança
- Pode ser adicionado quando necessário

---

## Estrutura de Pastas

**Decisão:** Monolítica modular

**Rationale:**
- Frontend e backend no mesmo repositório
- Simples de desenvolver e deployar
- Backend leve (BFF pattern)
- Separação clara por feature/responsabilidade

**Estrutura:**
```
src/
├── components/    # UI components
├── hooks/         # Business logic
├── lib/           # Utilities
├── store/         # Global state
└── schemas/       # Validation schemas
```

---

## Memoização

**Decisão:** React.memo para listas

**Rationale:**
- Performance em listas grandes
- Minimiza re-renders desnecessários
- Implementação simples
- Usado em: TransactionList, CustomerList, ServiceOrderList

---

*Última atualização: 2026-04-13*
