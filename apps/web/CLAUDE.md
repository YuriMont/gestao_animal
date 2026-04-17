# Gestão Animal — Web App CLAUDE.md

Guia de referência rápida para Claude Code e outros agentes de IA trabalhando neste pacote.

---

## Stack

| Camada          | Tecnologia                                              |
| --------------- | ------------------------------------------------------- |
| Framework       | React 19 + TypeScript 6 (strict mode)                   |
| Roteamento      | TanStack Router v1 (file-based, auto code-split)        |
| Estado servidor | TanStack React Query v5                                 |
| Estado cliente  | Jotai v2 (`atomWithStorage` para auth)                  |
| HTTP            | Axios 1.15 com instância customizada + interceptores    |
| Geração de API  | Kubb 4 — clientes/hooks/tipos gerados do OpenAPI        |
| Estilo          | Tailwind CSS 4 + shadcn/ui (estilo Radix Luma)          |
| Ícones          | Lucide React                                            |
| Linting         | Biome v2 (estende `@gestao/biome-config`)               |
| Build           | Vite 8                                                  |

---

## Comandos essenciais

```bash
yarn dev          # inicia dev server com HMR (http://localhost:5173)
yarn build        # tsc -b && vite build → dist/
yarn preview      # serve o build de produção localmente
yarn lint         # Biome check + auto-fix
yarn format       # Biome format
yarn generate     # Kubb — regenera src/gen/ a partir do OpenAPI do backend
```

> **`yarn generate` exige o backend rodando** em `VITE_API_URL` (padrão: `http://localhost:3333`).
> Nunca edite arquivos em `src/gen/` manualmente — eles são sobrescritos a cada geração.

---

## Variáveis de ambiente

```bash
VITE_API_URL=http://localhost:3333   # URL base do backend Fastify
```

Adicione em `.env` na raiz de `apps/web/`. Prefixo `VITE_` é obrigatório para expor ao browser via Vite.

---

## Estrutura de pastas

```
src/
├── assets/               # Imagens, fontes estáticas
├── atoms/
│   └── auth.ts           # Átomos Jotai: tokenAtom, userAtom, isAuthenticatedAtom, loginAtom, logoutAtom
├── components/
│   ├── layout/           # AppLayout (auth guard + sidebar), PageHeader
│   └── ui/               # Componentes shadcn/ui (Button, Card, Dialog, Table…)
├── lib/
│   ├── axiosInstance.ts  # Instância Axios com interceptores de auth
│   └── utils.ts          # cn() — helper de classNames
├── routes/               # Arquivo por rota (TanStack Router file-based)
│   ├── __root.tsx        # Layout raiz — envolve com <AuthProvider>
│   ├── index.tsx         # Dashboard /
│   ├── login.tsx         # /login
│   ├── animals.tsx       # /animals — CRUD completo com paginação
│   ├── health.tsx
│   ├── reproduction.tsx
│   ├── production.tsx
│   ├── financial.tsx
│   └── alerts.tsx
├── gen/                  # GERADO pelo Kubb — não editar
│   ├── clients/          # Funções Axios tipadas (uma pasta por tag OpenAPI)
│   ├── hooks/            # Hooks React Query (useGetV1Animals, usePostV1Animals…)
│   ├── models/           # Tipos TypeScript de request/response
│   ├── zod/              # Schemas Zod gerados
│   ├── mocks/            # Faker generators
│   └── msw/              # MSW handlers para testes
├── main.tsx              # Entry point — QueryClient + RouterProvider
├── router.tsx            # Configuração do TanStack Router
├── routeTree.gen.ts      # GERADO pelo plugin do router — não editar
└── index.css             # Diretivas Tailwind + tokens de design (CSS vars)
```

---

## Roteamento

TanStack Router com file-based routing. Cada arquivo em `src/routes/` vira uma rota.

| Arquivo           | URL             | Propósito                     |
| ----------------- | --------------- | ----------------------------- |
| `__root.tsx`      | (layout global) | Renderiza `<Outlet />` (sem Provider — Jotai usa store global) |
| `index.tsx`       | `/`             | Dashboard com KPIs e resumos  |
| `login.tsx`       | `/login`        | Login + cadastro (tabs)       |
| `animals.tsx`     | `/animals`      | CRUD de animais               |
| `health.tsx`      | `/health`       | Registros de saúde            |
| `reproduction.tsx`| `/reproduction` | Ciclos reprodutivos           |
| `production.tsx`  | `/production`   | Métricas de produção          |
| `financial.tsx`   | `/financial`    | Registros financeiros         |
| `alerts.tsx`      | `/alerts`       | Regras de alerta              |

`routeTree.gen.ts` é gerado automaticamente pelo plugin Vite do TanStack Router — nunca editar à mão.

### Como adicionar uma rota

1. Crie `src/routes/minha-rota.tsx`
2. Exporte um componente como default e use `createFileRoute('/minha-rota')`
3. O `routeTree.gen.ts` é regenerado automaticamente ao salvar

---

## Autenticação

**Átomos:** `src/atoms/auth.ts` (Jotai v2 com `atomWithStorage`)

- `tokenAtom` — token JWT sincronizado com `localStorage["token"]`
- `userAtom` — objeto user sincronizado com `localStorage["user"]`
- `isAuthenticatedAtom` — derived atom (`!!token && !!user`), somente leitura
- `loginAtom` — write atom; recebe `{ token, user }` e persiste ambos
- `logoutAtom` — write atom; limpa token/user e redireciona para `/login`

**`user` shape:** `{ id, email, name, role, organizationId }`

**Uso nos componentes:**

```tsx
import { useAtomValue, useSetAtom } from 'jotai'
import { userAtom, isAuthenticatedAtom, loginAtom, logoutAtom } from '@/atoms/auth'

const user = useAtomValue(userAtom)
const isAuthenticated = useAtomValue(isAuthenticatedAtom)
const login = useSetAtom(loginAtom)   // login({ token, user })
const logout = useSetAtom(logoutAtom) // logout()
```

**Guard:** `AppLayout` (`src/components/layout/app-layout.tsx`) redireciona para `/login` se `isAuthenticatedAtom` for `false`.

**Sem `<Provider>`:** Jotai usa store global por padrão em SPAs — não é necessário envolver a app com nenhum Provider de auth.

**Axios interceptors** (`src/lib/axiosInstance.ts`):
- Request → lê `localStorage["token"]` diretamente e adiciona `Authorization: Bearer`
- Response 401 → limpa `localStorage` e redireciona para `/login`

---

## Padrão de acesso a dados

Todo acesso à API usa os hooks gerados pelo Kubb em `src/gen/hooks/`.

### Query (GET)

```tsx
import { useGetV1Animals } from '@/gen/hooks/animalsController/useGetV1Animals';

const query = useGetV1Animals({ limit: 10, page: 1 });

if (query.isLoading) return <Skeleton />;
if (query.isError) return <p>Erro ao carregar</p>;

const animals = query.data?.data;   // array de animais
const meta = query.data?.meta;      // { total, page, limit, totalPages }
```

### Mutation (POST / PUT / DELETE)

```tsx
import { usePostV1Animals } from '@/gen/hooks/animalsController/usePostV1Animals';
import { getV1AnimalsQueryKey } from '@/gen/hooks/animalsController/useGetV1Animals';
import { useQueryClient } from '@tanstack/react-query';

const qc = useQueryClient();
const mutation = usePostV1Animals({
  mutation: {
    onSuccess: () => qc.invalidateQueries({ queryKey: getV1AnimalsQueryKey() }),
  },
});

mutation.mutate({ data: formData });
```

### Nomenclatura dos hooks gerados

| Método HTTP | Prefixo hook         | Exemplo                      |
| ----------- | -------------------- | ---------------------------- |
| GET         | `useGet`             | `useGetV1Animals`            |
| POST        | `usePost`            | `usePostV1Animals`           |
| PUT         | `usePut`             | `usePutV1AnimalsId`          |
| DELETE      | `useDelete`          | `useDeleteV1AnimalsId`       |

Os hooks vivem em `src/gen/hooks/<tag>Controller/`.

---

## Estrutura de uma página

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/page-header';

export const Route = createFileRoute('/minha-rota')({
  component: MinhaRota,
});

function MinhaRota() {
  return (
    <AppLayout>
      <PageHeader title="Título" description="Descrição opcional" />
      {/* conteúdo */}
    </AppLayout>
  );
}
```

---

## Componentes UI disponíveis

Todos em `src/components/ui/` (shadcn/ui). Importe via alias `@/components/ui/<nome>`.

`Button` `Card` `Input` `Dialog` `Tabs` `Table` `Badge` `Select` `Textarea` `Separator` `DropdownMenu` `Avatar` `Skeleton` `Label` `Sheet` `Popover` `Tooltip`

---

## Convenções de código

- **Nunca edite** `src/gen/` nem `src/routeTree.gen.ts` — são artefatos gerados
- **Alias `@/`** aponta para `src/` — sempre use em imports internos
- **`cn()`** de `@/lib/utils` para combinar classNames condicionalmente
- **Estado global:** React Query para estado de servidor; Jotai para estado cliente (auth). Prefira estado local para tudo mais
- **Novos átomos** vão em `src/atoms/` — use `atomWithStorage` se precisar persistir no localStorage
- **Linting:** `yarn lint` (Biome) antes de commitar. CI vai rejeitar se falhar
- **Sem comentários óbvios** — só comente o *porquê* quando não for evidente

---

## Fluxo de desenvolvimento com mudanças na API

1. Faça as mudanças no backend (`apps/server`)
2. Garanta que o Swagger/OpenAPI está atualizado (`/docs/openapi.json`)
3. Na pasta `apps/web`, rode `yarn generate`
4. Os tipos, hooks e clientes em `src/gen/` são atualizados automaticamente
5. Ajuste os componentes que consomem os hooks alterados

---

## Erros comuns

| Problema                              | Causa provável                              | Solução                                          |
| ------------------------------------- | ------------------------------------------- | ------------------------------------------------ |
| `routeTree.gen.ts` desatualizado      | Plugin Vite não rodou                       | `yarn dev` (gera automaticamente) ou `yarn build`|
| Hook não encontrado em `src/gen/`     | Kubb não rodou após mudança na API          | `yarn generate`                                  |
| 401 em todas as requisições           | Token expirado ou não salvo                 | Logout + login novamente                         |
| CORS no browser                       | Backend com ALLOWED_ORIGINS incorreto       | Adicionar `http://localhost:5173` no backend     |
| Tipo `undefined` em `query.data`      | API respondeu mas shape mudou               | Rode `yarn generate` para atualizar os tipos     |
| Vite não encontra `VITE_API_URL`      | `.env` ausente                              | Criar `apps/web/.env` com a variável             |
