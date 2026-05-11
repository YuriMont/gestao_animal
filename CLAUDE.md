# CLAUDE.md — Gestão Animal Monorepo

## Visão geral

Monorepo Yarn com Turbo para um sistema de gestão animal full-stack. Composto por:

- `apps/server` — API REST (Fastify + Prisma + PostgreSQL)
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
DATABASE_URL=postgresql://user:password@localhost:5432/gestao_animal
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

Segue padrão **"Flat by Default"** — 3-4 arquivos por resource, com escalabilidade gradual:

```
src/modules/<domínio>/
├── <dominio>.module.ts      # Fábrica de DI
├── routes.ts                # Registro de rotas
└── <recurso>/
    ├── <recurso>.types.ts       # Schemas Zod + interfaces
    ├── <recurso>.repository.ts  # Interface + implementação Prisma
    ├── <recurso>.service.ts     # Lógica de negócio
    └── <recurso>.controller.ts  # Handlers Fastify (singleton com DI)
```

Para módulos com uma única entidade (ex: `health`), os arquivos ficam na raiz do módulo. Para módulos com múltiplas entidades (ex: `core` com `animals`, `breeds`, `users`, `organizations`), cada entidade tem seu próprio subdiretório.

Módulos existentes: `auth`, `core` (animals, breeds, organizations, users), `health`, `reproduction`, `production`, `financial`.

Módulos com entidade única (ex: `health`, `financial`) têm os arquivos na raiz. Módulos com múltiplas entidades (ex: `core` com `animals/`, `breeds/`, `users/`, `organizations/`) usam subdiretórios.

**Adicionar endpoint:**
1. Crie schemas Zod em `<recurso>.types.ts`
2. Implemente lógica em `<recurso>.service.ts`
3. Adicione handler em `<recurso>.controller.ts`
4. Registre a rota em `routes.ts`
5. Conferir no Swagger UI: `http://localhost:3333/docs`

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

PostgreSQL via Prisma 7. Sem arquivos de migration — usar `prisma db push` após alterar `apps/server/prisma/schema.prisma`.

Modelos: Organization, User, Animal, Paddock, HealthRecord, Vaccine, Treatment, Estrus, Pregnancy, Birth, WeightRecord, MilkProduction, FinancialRecord.

## Linting

Biome (não ESLint/Prettier). Configuração base em `packages/biome-config/biome.json`, estendida por cada app. Rode `yarn format` antes de commitar.

## O que nunca fazer

- Editar `src/gen/` ou `src/routeTree.gen.ts` — são arquivos gerados
- Commitar `.env`
- Usar `prisma migrate` — o projeto usa `prisma db push` (PostgreSQL)
- Instalar ESLint ou Prettier — o projeto usa Biome
