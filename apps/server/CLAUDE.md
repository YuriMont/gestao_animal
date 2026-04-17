# Animal Management API — CLAUDE.md

Guia de referência rápida para Claude Code e outros agentes de IA trabalhando neste projeto.

---

## Stack

| Camada    | Tecnologia                                          |
| --------- | --------------------------------------------------- |
| Framework | Fastify v5 + TypeScript 6                           |
| Validação | Zod v4 + `fastify-type-provider-zod`                |
| ORM       | Prisma v7 com adapter `@prisma/adapter-pg`          |
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
yarn prisma migrate dev --name <nome>  # cria e aplica migration
yarn prisma db push   # aplica schema sem migration (dev only)
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
│   └── middleware/
│       └── tenant-context.ts     # Extrai x-tenant-id (fallback dev; JWT é primário)
├── infrastructure/
│   └── persistence/
│       └── prisma.service.ts     # Singleton do PrismaClient
├── types/
│   └── fastify.d.ts              # Augmentação: request.tenantId, request.user
└── modules/
    ├── auth/                     # POST /auth/login, POST /auth/register
    ├── core/                     # Animals, Organizations, Users (CRUD completo)
    ├── health/                   # HealthRecords, Vaccines, Treatments
    ├── reproduction/             # Estrus, Pregnancies, Births
    ├── production/               # WeightRecords, MilkProduction
    ├── financial/                # FinancialRecords
    └── alerts/                   # AlertRules, Notifications
```

Cada módulo segue a estrutura:

```
modules/<domínio>/
├── domain/
│   ├── entities/           # Classes de domínio (imutáveis, sem Prisma)
│   └── repositories/       # Interfaces IXxxRepository
├── infrastructure/
│   └── persistence/        # PrismaXxxRepository — implementação das interfaces
├── application/
│   └── use-cases/          # Um arquivo por caso de uso
└── presentation/
    ├── dtos/               # Schemas Zod para input/output
    ├── controllers/        # Handlers Fastify (orquestram use cases)
    └── routes.ts           # Registra rotas com schemas e controllers
```

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
DATABASE_URL="postgresql://user:password@localhost:5432/animal_db"
JWT_SECRET="string-longa-e-aleatoria-minimo-32-chars"
PORT=3333
NODE_ENV=development
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"
```

> **`JWT_SECRET` é obrigatório.** O servidor lança erro em runtime se não estiver definido.

---

## Como adicionar um novo módulo

1. **Crie a estrutura de pastas** seguindo o padrão `modules/<nome>/domain|infrastructure|application|presentation`
2. **Defina a entity** em `domain/entities/<nome>.entity.ts` — classe simples, sem Prisma
3. **Defina a interface** em `domain/repositories/<nome>.repository.ts`
4. **Implemente o repositório** em `infrastructure/persistence/prisma-<nome>.repository.ts`
5. **Crie use cases** em `application/use-cases/` — um arquivo por operação
6. **Crie DTOs** (schemas Zod) em `presentation/dtos/<nome>.dto.ts`
7. **Crie o controller** em `presentation/controllers/<nome>.controller.ts`
8. **Registre as rotas** em `presentation/routes.ts`
9. **Importe em `app.ts`** dentro do bloco `v1` (ou no bloco público se não precisar de auth)

---

## Como adicionar uma rota

```typescript
// presentation/routes.ts
app.get(
  "/meu-recurso/:id",
  {
    schema: {
      tags: ["MinhaTag"],
      summary: "Descrição curta",
      security: [{ bearerAuth: [] }], // sempre para rotas /v1
      params: z.object({ id: z.string().uuid() }),
      response: { 200: minhaResponseSchema },
    },
  },
  meuController.getById,
);
```

---

## Convenções de código

- **Entities** são imutáveis — nunca mute `props` diretamente; use `Entity.create()`
- **Repositórios** sempre recebem `organizationId` para isolar dados por tenant
- **Use cases** lançam `AppError` (ou subclasses) — nunca `new Error()` diretamente
- **Controllers** não têm `try/catch` — o `errorHandler` global captura tudo
- **DTOs** definem o contrato público da API; entities definem o modelo de domínio
- **Senhas** nunca são retornadas em respostas — `safeUser()` nos controllers de usuário

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
| `PrismaClient` não encontrado         | Client não gerado                         | `yarn prisma generate`                 |
| `x-tenant-id` obrigatório             | JWT não enviado / middleware legado ativo | Enviar `Authorization: Bearer <token>` |
| `Animal with this tag already exists` | Tag duplicada no org                      | Use tag única por organização          |
| CORS error                            | Origem não permitida                      | Adicionar em `ALLOWED_ORIGINS`         |

---

## Segurança — checklist ao adicionar código

- [ ] Senhas sempre hasheadas com `bcrypt.hash(senha, 12)`
- [ ] Respostas de usuário nunca incluem `password`
- [ ] Toda query filtra por `organizationId` (isolamento de tenant)
- [ ] Schemas Zod definidos para body, params e querystring
- [ ] Rotas novas têm `security: [{ bearerAuth: [] }]` no schema
- [ ] Não usar `JSON.stringify` em inputs do usuário sem sanitizar
