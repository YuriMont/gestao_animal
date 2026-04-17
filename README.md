# Gestão Animal

Monorepo full-stack para gerenciamento de rebanhos. Backend REST com Fastify + Prisma + MongoDB e frontend SPA com React + TanStack Router.

## Estrutura

```
gestao_animal/
├── apps/
│   ├── server/   # API REST (Fastify + Prisma + MongoDB)
│   └── web/      # SPA React (TanStack Router + React Query + Jotai)
└── packages/
    └── biome-config/   # Configuração Biome compartilhada
```

## Pré-requisitos

- Node.js 20+
- Yarn 1.22+
- MongoDB Atlas (ou instância local)

## Instalação

```bash
yarn install
```

## Variáveis de ambiente

**`apps/server/.env`**

```env
DATABASE_URL=mongodb+srv://...
JWT_SECRET=string-aleatoria-32-chars-minimo
PORT=3333
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

**`apps/web/.env`**

```env
VITE_API_URL=http://localhost:3333
```

## Desenvolvimento

```bash
# Roda backend + frontend em paralelo
yarn dev
```

| Serviço     | URL                         |
| ----------- | --------------------------- |
| Frontend    | http://localhost:5173        |
| Backend API | http://localhost:3333        |
| Swagger UI  | http://localhost:3333/docs   |
| Prisma GUI  | http://localhost:5555        |

### Primeira execução (banco de dados)

```bash
cd apps/server
yarn prisma db push
```

### Regenerar cliente após mudanças na API

```bash
cd apps/web
yarn generate   # requer backend rodando
```

## Scripts disponíveis

| Comando       | Descrição                              |
| ------------- | -------------------------------------- |
| `yarn dev`    | Inicia todos os apps em modo watch     |
| `yarn build`  | Build de produção (Turbo orquestra)    |
| `yarn lint`   | Lint em todos os pacotes               |
| `yarn format` | Formatação em todos os pacotes         |

## Arquitetura

### Backend (`apps/server`)

Segue Clean Architecture por módulo de domínio:

```
src/modules/<domínio>/
├── domain/
│   ├── entities/         # Classes TypeScript puras
│   └── repositories/     # Interfaces IXxxRepository
├── infrastructure/
│   └── persistence/      # PrismaXxxRepository
├── application/
│   └── use-cases/        # Lógica de negócio
└── presentation/
    ├── dtos/             # Schemas Zod
    ├── controllers/      # Handlers Fastify
    └── routes.ts         # Registro de rotas + OpenAPI
```

**Módulos:** `auth` · `core` (animals, organizations, users) · `health` · `reproduction` · `production` · `financial` · `alerts`

**Stack:** Fastify 5 · Prisma 7 · MongoDB · Zod 4 · JWT · Bcrypt · @scalar/fastify-api-reference

### Frontend (`apps/web`)

| Responsabilidade | Solução                          |
| ---------------- | -------------------------------- |
| Roteamento       | TanStack Router (file-based)     |
| Estado servidor  | TanStack React Query             |
| Estado cliente   | Jotai (`atomWithStorage`)        |
| HTTP             | Axios com interceptor de auth    |
| Geração de código| Kubb (OpenAPI → hooks + tipos)   |
| UI               | shadcn/ui + Tailwind CSS 4       |
| Build            | Vite 8                           |

**Rotas disponíveis:** `/` · `/login` · `/animals` · `/health` · `/reproduction` · `/production` · `/financial` · `/alerts`

### Multi-tenancy

Todo modelo Prisma carrega `organizationId`. O JWT inclui esse campo; o middleware o extrai para `request.tenantId` e todas as queries filtram por ele automaticamente.

## Banco de dados

MongoDB via Prisma 7 (sem migrations). Após alterar `schema.prisma`, rode:

```bash
cd apps/server
yarn prisma db push
```

**Modelos:** Organization · User · Animal · Paddock · HealthRecord · Vaccine · Treatment · Estrus · Pregnancy · Birth · WeightRecord · MilkProduction · FinancialRecord · AlertRule · Notification

## Geração de código (Kubb)

O diretório `apps/web/src/gen/` é gerado automaticamente — nunca editar manualmente.

```
GET    /v1/animals       → useGetV1Animals
GET    /v1/animals/:id   → useGetV1AnimalsId
POST   /v1/animals       → usePostV1Animals
PUT    /v1/animals/:id   → usePutV1AnimalsId
DELETE /v1/animals/:id   → useDeleteV1AnimalsId
```

## Linting

Biome (sem ESLint/Prettier). Configuração base em `packages/biome-config/biome.json`.

```bash
yarn lint     # verifica
yarn format   # corrige
```

## O que nunca fazer

- Editar `src/gen/` ou `src/routeTree.gen.ts` — arquivos gerados
- Commitar `.env`
- Usar `prisma migrate` — o projeto usa `prisma db push` (MongoDB)
- Instalar ESLint ou Prettier
