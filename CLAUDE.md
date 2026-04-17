# CLAUDE.md — Gestão Animal Monorepo

## Visão geral

Monorepo Yarn com Turbo para um sistema de gestão animal full-stack. Composto por:

- `apps/server` — API REST (Fastify + Prisma + MongoDB)
- `apps/web` — SPA React (TanStack Router + React Query + Jotai)
- `packages/biome-config` — Configuração Biome compartilhada

## Comandos essenciais

```bash
# Na raiz — roda tudo junto (recomendado para dev)
yarn dev

# Build de produção (Turbo orquestra ordem)
yarn build

# Lint + format em todos os pacotes
yarn lint
yarn format
```

```bash
# Backend — inicialização do banco (primeira vez ou após mudanças no schema)
cd apps/server
yarn prisma db push
yarn prisma studio  # GUI para inspecionar dados (localhost:5555)
```

```bash
# Frontend — regenerar cliente após mudanças na API
cd apps/web
yarn generate       # requer backend rodando em VITE_API_URL
```

## Variáveis de ambiente

**`apps/server/.env`** (nunca commitado):
```
DATABASE_URL=mongodb+srv://...
JWT_SECRET=string-aleatoria-32-chars-minimo
PORT=3333
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

**`apps/web/.env`** (nunca commitado):
```
VITE_API_URL=http://localhost:3333
```

## Arquitetura do backend (`apps/server`)

Segue Clean Architecture por módulo:

```
src/modules/<domínio>/
├── domain/
│   ├── entities/           # Classes puras TypeScript
│   └── repositories/       # Interfaces IXxxRepository
├── infrastructure/
│   └── persistence/        # Implementações PrismaXxxRepository
├── application/
│   └── use-cases/          # Lógica de negócio
└── presentation/
    ├── dtos/               # Schemas Zod
    ├── controllers/        # Handlers Fastify
    └── routes.ts           # Registro de rotas + OpenAPI
```

Módulos existentes: `auth`, `core` (animals, organizations, users), `health`, `reproduction`, `production`, `financial`, `alerts`.

**Adicionar endpoint:**
1. Schema Zod em `modules/<domínio>/presentation/dtos/`
2. Controller em `modules/<domínio>/presentation/controllers/`
3. Registrar em `modules/<domínio>/presentation/routes.ts`
4. Conferir no Swagger UI: `http://localhost:3333/docs`

## Arquitetura do frontend (`apps/web`)

**Roteamento:** File-based (TanStack Router). Criar `src/routes/minha-rota.tsx` → rota criada automaticamente. Nunca editar `src/routeTree.gen.ts`.

**Auth:**
- Atoms Jotai em `src/atoms/auth.ts` (`tokenAtom`, `userAtom`, `isAuthenticatedAtom`)
- `atomWithStorage` persiste em `localStorage`
- Axios interceptor lê `localStorage["token"]` e injeta `Authorization: Bearer`
- Em 401: limpa localStorage e redireciona para `/login`
- Proteção de rota via `AppLayout`

**Dados:**
- Todo acesso à API usa hooks gerados em `src/gen/hooks/` — nunca escrever chamadas axios manualmente para endpoints existentes
- Cache + loading via React Query; estado de cliente via Jotai
- Para invalidar cache após mutação: `queryClient.invalidateQueries({ queryKey: getV1XxxQueryKey() })`

**Adicionar página:**
1. Criar `src/routes/minha-pagina.tsx`
2. Envolver com `<AppLayout>` se for rota protegida
3. Usar hooks de `src/gen/hooks/`

## Geração de código (Kubb)

O diretório `src/gen/` é **gerado automaticamente** — jamais editar manualmente.

Fluxo:
1. Backend expõe OpenAPI em `/docs/openapi.json`
2. `kubb.config.ts` (em `apps/web`) lê o spec
3. `yarn generate` (em `apps/web`) regenera hooks, tipos, schemas Zod, mocks MSW

Convenção de nomes gerados:
```
GET    /v1/animals        → useGetV1Animals
GET    /v1/animals/:id    → useGetV1AnimalsId
POST   /v1/animals        → usePostV1Animals
PUT    /v1/animals/:id    → usePutV1AnimalsId
DELETE /v1/animals/:id    → useDeleteV1AnimalsId
```

## Multi-tenancy

Todo modelo Prisma tem `organizationId`. O JWT carrega o `organizationId` do usuário; o middleware extrai para `request.tenantId`. Toda query de repositório filtra por `tenantId`.

## Banco de dados

MongoDB via Prisma 7 (schemaless). Sem arquivos de migration — usar `prisma db push` após alterar `apps/server/prisma/schema.prisma`.

Modelos: Organization, User, Animal, Paddock, HealthRecord, Vaccine, Treatment, Estrus, Pregnancy, Birth, WeightRecord, MilkProduction, FinancialRecord, AlertRule, Notification.

## Linting

Biome (não ESLint/Prettier). Configuração base em `packages/biome-config/biome.json`, estendida por cada app. Rode `yarn format` antes de commitar.

## O que nunca fazer

- Editar `src/gen/` ou `src/routeTree.gen.ts` — são arquivos gerados
- Commitar `.env`
- Usar `prisma migrate` — o projeto usa `prisma db push` (MongoDB)
- Instalar ESLint ou Prettier — o projeto usa Biome
