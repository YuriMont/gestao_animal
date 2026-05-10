# Animal Management API — CLAUDE.md

Guia de referência rápida para Claude Code e outros agentes de IA trabalhando neste projeto.

---

## Stack

| Camada    | Tecnologia                                          |
| --------- | --------------------------------------------------- |
| Framework | Fastify v5 + TypeScript 6                           |
| Validação | Zod v4 + `fastify-type-provider-zod`                |
| ORM       | Prisma v6                                           |
| Banco     | PostgreSQL                                          |
| Auth      | JWT via `jsonwebtoken` + `bcrypt` (12 rounds)       |
| Docs      | Swagger (`@fastify/swagger`) + Scalar UI em `/docs` |
| Linting   | Biome v2                                            |

---

## Comandos essenciais

```bash
yarn run dev          # servidor com hot reload (tsx --watch)
yarn run build        # compila para dist/
yarn run lint         # Biome check + auto-fix
yarn run format       # Biome format

yarn prisma generate  # regenera o Prisma Client após mudar o schema
yarn prisma db push   # aplica schema no PostgreSQL (sem migrations)
yarn prisma studio    # GUI para inspecionar o banco
```

---

## Estrutura de pastas

```
src/
├── app.ts                        # Factory: plugins, rate limit, rotas, auth
├── server.ts                     # Ponto de entrada — escuta na porta 3333
├── plugins/
│   ├── auth.ts                   # authPlugin (preHandler JWT) + authorize()
│   ├── cors.ts                   # CORS restrito por ALLOWED_ORIGINS
│   ├── errorHandler.ts           # Trata AppError, validação Zod, erros genéricos
│   └── swagger.ts                # OpenAPI + Scalar UI
├── common/
│   ├── errors/
│   │   └── app-error.ts          # AppError, NotFoundError, ConflictError, etc.
│   └── lib/
│       ├── index.ts              # Barrel export
│       ├── pagination.ts         # PaginationMeta, paginated(), PaginatedResult<T>
│       └── enums.ts              # getEnumLabel(), getEnumValues(), createTranslatedEnumSchema()
├── infrastructure/
│   └── persistence/
│       └── prisma.service.ts     # Singleton do PrismaClient
├── types/
│   └── fastify.d.ts              # Augmentação: request.tenantId, request.user
└── modules/
    ├── auth/                     # POST /auth/login, POST /auth/register
    ├── core/                     # Animals, Breeds, Organizations, Users (CRUD completo)
    ├── health/                   # HealthRecords, Vaccines, Treatments
    ├── reproduction/             # Estrus, Pregnancies, Births
    ├── production/               # WeightRecords, MilkProduction
    ├── financial/                # FinancialRecords
    └── alerts/                   # AlertRules
```

Cada módulo segue a estrutura **"Flat by Default"** (3-4 arquivos por resource):

```
modules/<domínio>/
├── <dominio>.module.ts      # Fábrica de DI: instancia repo → service → controller
├── routes.ts                # Registro de rotas (importa controllers do module)
└── <recurso>/
    ├── <recurso>.types.ts       # Schemas Zod + interfaces (entrada/saída)
    ├── <recurso>.repository.ts  # Interface + implementação Prisma (mesmo arquivo)
    ├── <recurso>.service.ts     # Lógica de negócio (1 classe, N métodos)
    └── <recurso>.controller.ts  # Handlers Fastify (singleton com DI via constructor)
```

Para módulos com uma única entidade (ex: `alerts`, `health`), os arquivos ficam na raiz. Para módulos com múltiplas entidades (ex: `core` com `animals`, `breeds`, `users`, `organizations`), cada entidade tem seu próprio subdiretório.

**Quando aprofundar** (escalabilidade gradual):
- Lógica complexa → extraia `domain/` entities + use-cases do service
- Múltiplos providers → extraia interface do repositório
- Regra compartilhada → mova para `common/lib/`

---

## Arquitetura de autenticação

```
POST /auth/login → retorna Bearer token (JWT 24h)

Todas as rotas /v1/* exigem:
  Authorization: Bearer <token>

O JWT payload contém: { id, email, role, organizationId }
authPlugin extrai e popula request.user e request.tenantId

Rotas públicas: GET /, POST /auth/login, POST /auth/register
```

### Adicionar autenticação a uma rota

```typescript
// Já protegida automaticamente — toda rota em /v1/* usa authPlugin via preHandler no escopo

// Para proteger por role:
import { authorize } from '@src/plugins/auth';

app.delete('/something/:id', {
  preHandler: [authorize('MANAGER', 'VET')],
  schema: { ... },
}, controller.delete);
```

---

## Padrão de resposta

### Sucesso — recurso único

```json
{ "id": "uuid", ...campos }
```

### Sucesso — lista paginada

```json
{
  "data": [ { "id": "uuid", ...campos } ],
  "meta": { "total": 100, "page": 1, "limit": 20, "totalPages": 5 }
}
```

### Erro (AppError)

```json
{ "error": "NOT_FOUND", "message": "Animal not found" }
```

### Erro de validação (Zod)

```json
{ "error": "Validation Error", "message": "Invalid request data", "details": [...] }
```

---

## Variáveis de ambiente necessárias

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/gestao_animal"
JWT_SECRET="string-longa-e-aleatoria-minimo-32-chars"
PORT=3333
NODE_ENV=development
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"
```

> **`JWT_SECRET` é obrigatório.** O servidor lança erro em runtime se não estiver definido.

---

## Como adicionar um novo módulo

1. **Crie a estrutura de pastas:** para módulos com entidade única, arquivos na raiz do módulo. Para múltiplas entidades (ex: `core`), crie um subdiretório por entidade.
2. **Defina os schemas Zod** em `<recurso>.types.ts` — input, output, query (substitui entities + dtos)
3. **Defina interface + implementação Prisma** em `<recurso>.repository.ts` (mesmo arquivo)
4. **Crie a lógica de negócio** em `<recurso>.service.ts` — 1 classe, N métodos (substitui N use-cases)
5. **Crie o controller** em `<recurso>.controller.ts` — classe com DI via constructor (singleton)
6. **Crie o module** em `<dominio>.module.ts` — fábrica que instancia repo → service → controller
7. **Registre as rotas** em `routes.ts` — importe controllers do module
8. **Importe em `app.ts`** dentro do bloco `v1` (ou no bloco público se não precisar de auth)

```typescript
// Exemplo: <dominio>.module.ts
import { PrismaService } from "@src/infrastructure/persistence/prisma.service";
import { MeuResourceController } from "./meu-resource.controller";
import { PrismaMeuResourceRepository } from "./meu-resource.repository";
import { MeuResourceService } from "./meu-resource.service";

const prisma = PrismaService.getInstance();
const repo = new PrismaMeuResourceRepository(prisma);
const service = new MeuResourceService(repo);
export const meuResourceController = new MeuResourceController(service);
```

---

## Breeds

CRUD completo disponível em `/v1/breeds`.

| Método | Rota             | Descrição                          |
| ------ | ---------------- | ---------------------------------- |
| POST   | `/v1/breeds`     | Cria raça (body: `name`, `species`) |
| GET    | `/v1/breeds`     | Lista paginada (filtro: `species`) |
| GET    | `/v1/breeds/:id` | Busca por ID                       |
| PUT    | `/v1/breeds/:id` | Atualiza raça                      |
| DELETE | `/v1/breeds/:id` | Remove raça                        |

**Unicidade**: `name + species + organizationId`. Violação retorna `409 CONFLICT`.

---

## Como adicionar uma rota

```typescript
// routes.ts
app.get(
  "/meu-recurso/:id",
  {
    schema: {
      tags: ["MinhaTag"],
      summary: "Descrição curta",
      security: [{ bearerAuth: [] }], // sempre para rotas /v1
      params: z.object({ id: z.string() }),
      response: { 200: minhaResponseSchema },
    },
  },
  meuController.getById,
);
```

---

## Convenções de código

- **Types**: Schemas Zod definem contratos de input/output; interfaces TypeScript para records do banco
- **Repositórios**: Interface + implementação Prisma no mesmo arquivo; assinaturas recebem dados prontos (sem entity classes)
- **Services**: Lançam `AppError` (ou subclasses) — nunca `new Error()` diretamente
- **Controllers**: Não têm `try/catch` — o `errorHandler` global captura tudo. Usam arrow functions para preservar `this`
- **DI**: Controllers são singletons instanciados no `<dominio>.module.ts` — nunca `new Controller()` por request
- **Records**: O tipo retornado do repositório é o `Record` (Prisma shape), não uma entity class
- **Senhas**: Nunca são retornadas em respostas — `safeUser()` nos services de usuário

---

## Rate limiting

- **Global**: 100 req/min por IP
- Para rotas críticas (ex: login), adicione um preHandler com limite menor:

```typescript
import rateLimit from "@fastify/rate-limit";
// registre na rota específica com max menor
```

---

## Erros comuns

| Problema                              | Causa provável                            | Solução                                |
| ------------------------------------- | ----------------------------------------- | -------------------------------------- |
| `JWT_SECRET is not configured`        | `.env` não carregado                      | Verificar `dotenv` e caminho do `.env` |
| `PrismaClient` não encontrado         | Client não gerado                             | `yarn prisma generate`                 |
| Banco não encontrado                  | PostgreSQL não está rodando                   | Verificar se o PostgreSQL está ativo     |
| `x-tenant-id` obrigatório             | JWT não enviado / middleware legado ativo | Enviar `Authorization: Bearer <token>` |
| `Animal with this tag already exists` | Tag duplicada no org                      | Use tag única por organização          |
| `Breed with this name and species already exists` | Raça duplicada no org             | `name` + `species` deve ser único por organização |
| CORS error                            | Origem não permitida                      | Adicionar em `ALLOWED_ORIGINS`         |

---

## Segurança — checklist ao adicionar código

- [ ] Senhas sempre hasheadas com `bcrypt.hash(senha, 12)`
- [ ] Respostas de usuário nunca incluem `password`
- [ ] Toda query filtra por `organizationId` (isolamento de tenant)
- [ ] Schemas Zod definidos para body, params e querystring
- [ ] Rotas novas têm `security: [{ bearerAuth: [] }]` no schema
- [ ] Não usar `JSON.stringify` em inputs do usuário sem sanitizar
