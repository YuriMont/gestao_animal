# Insemination Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fully functional insemination tab to the `/reproduction` page with a registration form and a recent-inseminations list.

**Architecture:** Follow the existing `PregnancyView` pattern — one combined component (`InseminationView`) that renders a form on the left and a list on the right inside a responsive grid. Hooks come from Kubb-generated files (`src/gen/`) that are regenerated from the backend OpenAPI spec before any component work begins. The `AnimalSelect` component needs a `maleOnly` prop added to support selecting bulls/donors.

**Tech Stack:** React 19, TanStack Query v5, Kubb 4 (generated hooks), shadcn/ui, Tailwind CSS 4, Jotai (auth only)

---

## Files Overview

**Prerequisite (not a code change):**
- Run `yarn generate` in `apps/web/` — regenerates `src/gen/` from the backend OpenAPI

**Modify:**
- `apps/web/src/components/reproduction/animal-select.tsx` — add `maleOnly` prop
- `apps/web/src/routes/reproduction.tsx` — add insemination tab (4th tab)

**Create:**
- `apps/web/src/components/reproduction/insemination-view.tsx` — combined form + list, follows `pregnancy-view.tsx` pattern

---

## Task 1: Regenerate API Hooks

This task **must run before any component work**. The `InseminationView` component imports hooks that only exist after generation.

- [ ] **Step 1: Start the backend**

Open a terminal at the repo root and run:
```bash
cd apps/server && yarn dev
```

Wait until you see: `Server listening at http://[::1]:3333`

- [ ] **Step 2: Run code generation**

In a second terminal at `apps/web/`:
```bash
yarn generate
```

Expected output: Kubb prints a list of generated files. Look for these among them:
```
src/gen/hooks/reproductionController/usePostV1ReproductionInseminations.ts
src/gen/hooks/reproductionController/useGetV1ReproductionInseminations.ts
src/gen/hooks/enumsController/useGetV1EnumsReproductionInseminationTypes.ts
src/gen/models/reproductionController/PostV1ReproductionInseminations.ts
```

If these four files do not appear, the backend is not running on the URL set in `apps/web/.env` (`VITE_API_URL`). Fix the URL and retry.

- [ ] **Step 3: Confirm the generated query key export**

Open `src/gen/hooks/reproductionController/useGetV1ReproductionInseminations.ts` and confirm it exports a function named `getV1ReproductionInseminationsQueryKey`. This is used for cache invalidation in `InseminationView`.

- [ ] **Step 4: Confirm the type name for the `type` field**

Open `src/gen/models/reproductionController/PostV1ReproductionInseminations.ts` and find the exported type for the `type` field enum key. It will look like:
```typescript
export type PostV1ReproductionInseminationsMutationRequestTypeEnumKey = 'NATURAL_MATING' | 'ARTIFICIAL_INSEMINATION' | 'EMBRYO_TRANSFER'
```

Note the exact type name — you will use it in `InseminationView` in Task 3.

- [ ] **Step 5: Commit generated files**

```bash
git add apps/web/src/gen/
git commit -m "chore(web): regenerate API hooks with insemination endpoints"
```

---

## Task 2: Add `maleOnly` Prop to AnimalSelect

**Files:**
- Modify: `apps/web/src/components/reproduction/animal-select.tsx`

The current component only supports `femaleOnly`. When `femaleOnly` is `undefined`, it shows all animals (no sex filter). We need a `maleOnly` prop to show only bulls/donors.

Current behavior of the sex filter logic:
```typescript
...(femaleOnly !== undefined ? { sex: femaleOnly ? 'FEMALE' : 'MALE' } : {})
```

This only applies a filter when `femaleOnly` is not `undefined`. We need to extend this to also handle `maleOnly`.

- [ ] **Step 1: Replace the component with the updated version**

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useGetV1Animals } from '@/gen/hooks/animalsController/useGetV1Animals'

export function AnimalSelect({
  value,
  onChange,
  femaleOnly,
  maleOnly,
}: {
  value: string
  onChange: (v: string) => void
  femaleOnly?: boolean
  maleOnly?: boolean
}) {
  const sex = femaleOnly ? 'FEMALE' : maleOnly ? 'MALE' : undefined
  const animalsQuery = useGetV1Animals({
    limit: 100,
    ...(sex !== undefined ? { sex } : {}),
  })
  const animals = animalsQuery.data?.data ?? []
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione o animal" />
      </SelectTrigger>
      <SelectContent>
        {animals.map(a => (
          <SelectItem key={a.id} value={a.id}>
            {a.tag} — {a.species} ({a.sex === 'MALE' ? 'M' : 'F'})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

- [ ] **Step 2: Verify existing usages still compile**

`femaleOnly` is used in `estrus-form.tsx`, `pregnancy-view.tsx`, and `birth-form.tsx`. The change is backwards-compatible (new optional prop, logic unchanged for `femaleOnly` callers). Run the TypeScript check:

```bash
cd apps/web && yarn tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/reproduction/animal-select.tsx
git commit -m "feat(web): add maleOnly prop to AnimalSelect"
```

---

## Task 3: Create InseminationView Component

**Files:**
- Create: `apps/web/src/components/reproduction/insemination-view.tsx`

This component follows the exact pattern of `pregnancy-view.tsx`: a two-column grid with a form card on the left and a list card on the right. It uses:
- `usePostV1ReproductionInseminations` for the create mutation
- `useGetV1ReproductionInseminations` for the paginated list
- `useGetV1EnumsReproductionInseminationTypes` for enum labels (same pattern as `useGetV1EnumsReproductionPregnancyStatus` in `pregnancy-view.tsx`)
- `AnimalSelect` with `femaleOnly` for the female and `maleOnly` for the sire

**Before writing the code**, confirm the exact type name from Task 1 Step 4. The code below uses `PostV1ReproductionInseminationsMutationRequestTypeEnumKey` — replace it if the actual generated name differs.

- [ ] **Step 1: Create the file**

```tsx
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useGetV1EnumsReproductionInseminationTypes } from '@/gen/hooks/enumsController/useGetV1EnumsReproductionInseminationTypes'
import {
  getV1ReproductionInseminationsQueryKey,
  useGetV1ReproductionInseminations,
} from '@/gen/hooks/reproductionController/useGetV1ReproductionInseminations'
import { usePostV1ReproductionInseminations } from '@/gen/hooks/reproductionController/usePostV1ReproductionInseminations'
import type { PostV1ReproductionInseminationsMutationRequestTypeEnumKey } from '@/gen/models/reproductionController/PostV1ReproductionInseminations'
import { useQueryClient } from '@tanstack/react-query'
import { AnimalSelect } from './animal-select'

const INITIAL_FORM = {
  animalId: '',
  type: '' as PostV1ReproductionInseminationsMutationRequestTypeEnumKey | '',
  date: '',
  fatherId: '',
  semenBatch: '',
}

export function InseminationView() {
  const qc = useQueryClient()
  const [form, setForm] = useState(INITIAL_FORM)
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null)

  const { data: inseminationTypes } = useGetV1EnumsReproductionInseminationTypes()
  const listQuery = useGetV1ReproductionInseminations({ page: 1, limit: 20 })
  const inseminations = listQuery.data?.data ?? []

  function showFeedback(ok: boolean, msg: string) {
    setFeedback({ ok, msg })
    setTimeout(() => setFeedback(null), 3000)
  }

  const mutation = usePostV1ReproductionInseminations({
    mutation: {
      onSuccess: () => {
        setForm(INITIAL_FORM)
        showFeedback(true, 'Inseminação registrada!')
        qc.invalidateQueries({ queryKey: getV1ReproductionInseminationsQueryKey() })
      },
      onError: () => showFeedback(false, 'Erro ao registrar inseminação.'),
    },
  })

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="size-4" />
            Nova Inseminação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Fêmea *</Label>
            <AnimalSelect
              value={form.animalId}
              onChange={v => setForm({ ...form, animalId: v })}
              femaleOnly
            />
          </div>

          <div className="space-y-1.5">
            <Label>Tipo *</Label>
            <Select
              value={form.type}
              onValueChange={v =>
                setForm({
                  ...form,
                  type: v as PostV1ReproductionInseminationsMutationRequestTypeEnumKey,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {inseminationTypes?.map(item => (
                  <SelectItem key={item.key} value={item.key}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Data</Label>
            <Input
              type="date"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Touro / Doador</Label>
            <AnimalSelect
              value={form.fatherId}
              onChange={v => setForm({ ...form, fatherId: v })}
              maleOnly
            />
          </div>

          <div className="space-y-1.5">
            <Label>Lote de Sêmen</Label>
            <Input
              placeholder="Ex: LOTE-2024-01"
              value={form.semenBatch}
              onChange={e => setForm({ ...form, semenBatch: e.target.value })}
            />
          </div>

          {feedback && (
            <p
              className={`text-sm ${feedback.ok ? 'text-primary' : 'text-destructive'}`}
            >
              {feedback.msg}
            </p>
          )}

          <Button
            className="w-full"
            disabled={mutation.isPending || !form.animalId || !form.type}
            onClick={() =>
              mutation.mutate({
                data: {
                  animalId: form.animalId,
                  type: form.type as PostV1ReproductionInseminationsMutationRequestTypeEnumKey,
                  date: form.date || undefined,
                  fatherId: form.fatherId || undefined,
                  semenBatch: form.semenBatch || undefined,
                },
              })
            }
          >
            {mutation.isPending ? 'Salvando...' : 'Registrar Inseminação'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inseminações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {listQuery.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : inseminations.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Nenhuma inseminação registrada
            </p>
          ) : (
            <div className="space-y-2">
              {inseminations.slice(0, 6).map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                >
                  <span className="font-medium">{item.animalId}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {inseminationTypes?.find(t => t.key === item.type)?.label ?? item.type}
                    </Badge>
                    <Badge variant="default">
                      {new Date(item.date).toLocaleDateString('pt-BR')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Run TypeScript check**

```bash
cd apps/web && yarn tsc --noEmit
```

Expected: no errors. If you see "Cannot find module '@/gen/hooks/...'" errors, Task 1 (`yarn generate`) was not completed — go back and run it.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/reproduction/insemination-view.tsx
git commit -m "feat(web): add InseminationView component"
```

---

## Task 4: Add Insemination Tab to Reproduction Page

**Files:**
- Modify: `apps/web/src/routes/reproduction.tsx`

The current page has 3 tabs in a `grid-cols-3` grid. We add a 4th tab for insemination.

- [ ] **Step 1: Replace the file with the updated version**

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from '@/components/layout/app-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EstrusForm } from '@/components/reproduction/estrus-form'
import { InseminationView } from '@/components/reproduction/insemination-view'
import { PregnancyView } from '@/components/reproduction/pregnancy-view'
import { BirthForm } from '@/components/reproduction/birth-form'

export const Route = createFileRoute('/reproduction')({
  component: ReproductionPage,
})

function ReproductionPage() {
  return (
    <AppLayout>
      <div className="flex flex-col">
        <PageHeader
          title="Reprodução"
          description="Controle de ciclos reprodutivos, gestações e partos"
        />
        <div className="p-6 mx-auto w-full max-w-4xl">
          <Tabs defaultValue="insemination" className="w-full">
            <TabsList className="w-full grid grid-cols-4 max-w-lg mx-auto mb-6">
              <TabsTrigger value="insemination">Inseminação</TabsTrigger>
              <TabsTrigger value="estrus">Estro / Cio</TabsTrigger>
              <TabsTrigger value="pregnancy">Gestação</TabsTrigger>
              <TabsTrigger value="birth">Partos</TabsTrigger>
            </TabsList>

            <TabsContent value="insemination" className="mt-4">
              <InseminationView />
            </TabsContent>

            <TabsContent value="estrus" className="mt-4 flex justify-center">
              <EstrusForm />
            </TabsContent>

            <TabsContent value="pregnancy" className="mt-4">
              <PregnancyView />
            </TabsContent>

            <TabsContent value="birth" className="mt-4 flex justify-center">
              <BirthForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  )
}
```

- [ ] **Step 2: Run TypeScript check**

```bash
cd apps/web && yarn tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Start dev server and verify**

```bash
cd apps/web && yarn dev
```

Open `http://localhost:5173/reproduction`. Verify:
- 4 tabs appear: "Inseminação", "Estro / Cio", "Gestação", "Partos"
- "Inseminação" is the default active tab
- The insemination form renders with: Fêmea selector, Tipo dropdown, Data input, Touro/Doador selector, Lote de Sêmen input, and a disabled submit button
- The "Fêmea" selector only shows female animals
- The "Touro / Doador" selector only shows male animals
- The "Tipo" dropdown shows: "Monta Natural", "Inseminação Artificial", "Transferência de Embrião"
- The list card shows "Nenhuma inseminação registrada" when empty

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/routes/reproduction.tsx
git commit -m "feat(web): add insemination tab to reproduction page"
```
