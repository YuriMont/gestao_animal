# Insemination Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add full insemination CRUD (create + list) to backend and a form + list view to the frontend reproduction page.

**Architecture:** Follow the existing reproduction module pattern — domain entity → repository interface → Prisma implementation → DTOs → controller handlers → routes. The Prisma `Insemination` model already exists; only the application layer is missing. Frontend gets a new tab in `/reproduction` with an `InseminationForm` (POST) and `InseminationView` (GET paginated list), using Kubb-generated hooks after `yarn generate`.

**Tech Stack:** Fastify v5, Prisma v6, MongoDB, Zod v4, React 19, TanStack Query v5, Kubb 4, shadcn/ui, Tailwind CSS 4

---

## Files Overview

**Create:**
- `apps/server/src/modules/reproduction/domain/entities/insemination.entity.ts`
- `apps/web/src/components/reproduction/insemination-form.tsx`
- `apps/web/src/components/reproduction/insemination-view.tsx`

**Modify:**
- `apps/server/src/modules/reproduction/domain/repositories/reproduction.repository.ts` — add insemination methods
- `apps/server/src/modules/reproduction/infrastructure/persistence/reproduction.repository.ts` — add Prisma implementations
- `apps/server/src/modules/reproduction/presentation/dtos/reproduction.dto.ts` — add insemination schemas
- `apps/server/src/modules/reproduction/presentation/controllers/reproduction.controller.ts` — add insemination handlers
- `apps/server/src/modules/reproduction/presentation/routes.ts` — register insemination routes
- `apps/web/src/routes/reproduction.tsx` — add insemination tab

---

## Task 1: Domain Entity

**Files:**
- Create: `apps/server/src/modules/reproduction/domain/entities/insemination.entity.ts`

- [ ] **Step 1: Create the entity file**

```typescript
import type { InseminationType } from "@prisma/client";

export interface InseminationProps {
  animalId: string;
  type: InseminationType;
  date: Date;
  fatherId?: string;
  semenBatch?: string;
  success?: boolean;
  organizationId: string;
}

export class Insemination {
  constructor(
    public readonly props: InseminationProps,
    public readonly id?: string,
  ) {}

  public static create(props: InseminationProps, id?: string): Insemination {
    return new Insemination(props, id);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/server/src/modules/reproduction/domain/entities/insemination.entity.ts
git commit -m "feat(reproduction): add Insemination domain entity"
```

---

## Task 2: Repository Interface

**Files:**
- Modify: `apps/server/src/modules/reproduction/domain/repositories/reproduction.repository.ts`

- [ ] **Step 1: Add insemination imports and methods**

Replace the entire file with:

```typescript
import type { Birth } from "@src/modules/reproduction/domain/entities/birth.entity";
import type { Estrus } from "@src/modules/reproduction/domain/entities/estrus.entity";
import type { Insemination } from "@src/modules/reproduction/domain/entities/insemination.entity";
import type { Pregnancy } from "@src/modules/reproduction/domain/entities/pregnancy.entity";

export interface IReproductionRepository {
  createEstrus(estrus: Estrus): Promise<Estrus>;
  createPregnancy(pregnancy: Pregnancy): Promise<Pregnancy>;
  createBirth(birth: Birth): Promise<Birth>;
  createInsemination(insemination: Insemination): Promise<Insemination>;

  findPregnanciesByOrganization(
    organizationId: string,
    page?: number,
    limit?: number,
  ): Promise<{ pregnancies: Pregnancy[]; total: number }>;
  findInseminationsByOrganization(
    organizationId: string,
    page?: number,
    limit?: number,
  ): Promise<{ inseminations: Insemination[]; total: number }>;
  findReproductionHistoryByAnimal(
    animalId: string,
    organizationId: string,
  ): Promise<{
    estrus: Estrus[];
    pregnancies: Pregnancy[];
    births: Birth[];
    inseminations: Insemination[];
  }>;
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/server/src/modules/reproduction/domain/repositories/reproduction.repository.ts
git commit -m "feat(reproduction): extend repository interface with insemination methods"
```

---

## Task 3: Prisma Repository Implementation

**Files:**
- Modify: `apps/server/src/modules/reproduction/infrastructure/persistence/reproduction.repository.ts`

- [ ] **Step 1: Add Insemination import at the top of the file**

After the existing imports, add:

```typescript
import { Insemination } from "@src/modules/reproduction/domain/entities/insemination.entity";
```

- [ ] **Step 2: Add `createInsemination` method to the class**

Add after `createBirth`:

```typescript
  async createInsemination(insemination: Insemination): Promise<Insemination> {
    const created = await this.prisma.insemination.create({
      data: {
        animalId: insemination.props.animalId,
        type: insemination.props.type,
        date: insemination.props.date,
        fatherId: insemination.props.fatherId ?? undefined,
        semenBatch: insemination.props.semenBatch ?? undefined,
        success: insemination.props.success ?? undefined,
        organizationId: insemination.props.organizationId,
      },
    });
    return Insemination.create({ ...insemination.props }, created.id);
  }
```

- [ ] **Step 3: Add `findInseminationsByOrganization` method**

Add after `findPregnanciesByOrganization`:

```typescript
  async findInseminationsByOrganization(
    organizationId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ inseminations: Insemination[]; total: number }> {
    const skip = (page - 1) * limit;
    const [results, total] = await Promise.all([
      this.prisma.insemination.findMany({
        where: { organizationId },
        skip,
        take: limit,
        orderBy: { date: "desc" },
      }),
      this.prisma.insemination.count({ where: { organizationId } }),
    ]);
    return {
      inseminations: results.map((i) =>
        Insemination.create(
          {
            animalId: i.animalId,
            type: i.type,
            date: i.date,
            fatherId: i.fatherId ?? undefined,
            semenBatch: i.semenBatch ?? undefined,
            success: i.success ?? undefined,
            organizationId: i.organizationId,
          },
          i.id,
        ),
      ),
      total,
    };
  }
```

- [ ] **Step 4: Update `findReproductionHistoryByAnimal` to include inseminations**

Replace the method body:

```typescript
  async findReproductionHistoryByAnimal(
    animalId: string,
    organizationId: string,
  ) {
    const [estrus, pregnancies, births, inseminations] = await Promise.all([
      this.prisma.estrus.findMany({ where: { animalId, organizationId } }),
      this.prisma.pregnancy.findMany({ where: { animalId, organizationId } }),
      this.prisma.birth.findMany({
        where: {
          OR: [{ motherId: animalId }, { fatherId: animalId }],
          organizationId,
        },
      }),
      this.prisma.insemination.findMany({
        where: {
          OR: [{ animalId }, { fatherId: animalId }],
          organizationId,
        },
      }),
    ]);

    return {
      estrus: estrus.map((e) =>
        Estrus.create(
          {
            animalId: e.animalId,
            startDate: e.startDate,
            endDate: e.endDate ?? undefined,
            observation: e.observation ?? undefined,
            organizationId: e.organizationId,
          },
          e.id,
        ),
      ),
      pregnancies: pregnancies.map((p) =>
        Pregnancy.create(
          {
            animalId: p.animalId,
            detectedDate: p.detectedDate,
            expectedDate: p.expectedDate ?? undefined,
            status: p.status,
            organizationId: p.organizationId,
          },
          p.id,
        ),
      ),
      births: births.map((b) =>
        Birth.create(
          {
            motherId: b.motherId,
            fatherId: b.fatherId ?? undefined,
            birthDate: b.birthDate ?? undefined,
            offspringTag: b.offspringTag ?? undefined,
            status: b.status,
            organizationId: b.organizationId,
          },
          b.id,
        ),
      ),
      inseminations: inseminations.map((i) =>
        Insemination.create(
          {
            animalId: i.animalId,
            type: i.type,
            date: i.date,
            fatherId: i.fatherId ?? undefined,
            semenBatch: i.semenBatch ?? undefined,
            success: i.success ?? undefined,
            organizationId: i.organizationId,
          },
          i.id,
        ),
      ),
    };
  }
```

- [ ] **Step 5: Commit**

```bash
git add apps/server/src/modules/reproduction/infrastructure/persistence/reproduction.repository.ts
git commit -m "feat(reproduction): implement insemination persistence methods"
```

---

## Task 4: DTOs

**Files:**
- Modify: `apps/server/src/modules/reproduction/presentation/dtos/reproduction.dto.ts`

- [ ] **Step 1: Add InseminationType import and insemination schemas**

Add `InseminationType` to the existing `@prisma/client` import:

```typescript
import { BirthStatus, InseminationType, PregnancyStatus } from "@prisma/client";
```

Then add at the end of the file, before the `export type` lines:

```typescript
export const createInseminationSchema = z.object({
  animalId: z.string(),
  type: z.nativeEnum(InseminationType),
  date: z.coerce.date().optional(),
  fatherId: z.string().optional(),
  semenBatch: z.string().optional(),
  success: z.boolean().optional(),
});

export const inseminationResponseSchema = z.object({
  id: z.string(),
  animalId: z.string(),
  type: z.nativeEnum(InseminationType),
  date: z.date(),
  fatherId: z.string().optional(),
  semenBatch: z.string().optional(),
  success: z.boolean().optional(),
  organizationId: z.string(),
});
```

Then add the corresponding type exports:

```typescript
export type CreateInseminationDTO = z.infer<typeof createInseminationSchema>;
export type InseminationResponseDTO = z.infer<typeof inseminationResponseSchema>;
```

- [ ] **Step 2: Commit**

```bash
git add apps/server/src/modules/reproduction/presentation/dtos/reproduction.dto.ts
git commit -m "feat(reproduction): add insemination DTOs and Zod schemas"
```

---

## Task 5: Controller

**Files:**
- Modify: `apps/server/src/modules/reproduction/presentation/controllers/reproduction.controller.ts`

- [ ] **Step 1: Add Insemination entity import**

Add to existing imports:

```typescript
import { Insemination } from "@src/modules/reproduction/domain/entities/insemination.entity";
```

Also add `CreateInseminationDTO` to the DTO imports:

```typescript
import type {
  CreateBirthDTO,
  CreateEstrusDTO,
  CreateInseminationDTO,
  CreatePregnancyDTO,
} from "@src/modules/reproduction/presentation/dtos/reproduction.dto";
```

- [ ] **Step 2: Add `createInsemination` handler**

Add after `createBirth`:

```typescript
  async createInsemination(
    request: FastifyRequest<{ Body: CreateInseminationDTO }>,
    reply: FastifyReply,
  ) {
    const tenantId = request.tenantId!;
    const repository = new PrismaReproductionRepository(
      PrismaService.getInstance(),
    );
    const insemination = await repository.createInsemination(
      Insemination.create({
        ...request.body,
        date: request.body.date ?? new Date(),
        organizationId: tenantId,
      }),
    );
    return reply.status(201).send({
      message: "Insemination recorded",
      insemination: { id: insemination.id, ...insemination.props },
    });
  },
```

- [ ] **Step 3: Add `getInseminations` handler**

Add after `getPregnancies`:

```typescript
  async getInseminations(
    request: FastifyRequest<{ Querystring: { page: number; limit: number } }>,
    reply: FastifyReply,
  ) {
    const tenantId = request.tenantId!;
    const { page, limit } = request.query;
    const repository = new PrismaReproductionRepository(
      PrismaService.getInstance(),
    );
    const { inseminations, total } =
      await repository.findInseminationsByOrganization(tenantId, page, limit);
    return reply.send({
      data: inseminations.map((item) => ({ id: item.id, ...item.props })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  },
```

- [ ] **Step 4: Update `getAnimalHistory` to include inseminations**

Replace the return statement in `getAnimalHistory`:

```typescript
    return reply.send({
      estrus: history.estrus.map((e) => ({ id: e.id, ...e.props })),
      pregnancies: history.pregnancies.map((p) => ({ id: p.id, ...p.props })),
      births: history.births.map((b) => ({ id: b.id, ...b.props })),
      inseminations: history.inseminations.map((i) => ({ id: i.id, ...i.props })),
    });
```

- [ ] **Step 5: Commit**

```bash
git add apps/server/src/modules/reproduction/presentation/controllers/reproduction.controller.ts
git commit -m "feat(reproduction): add insemination controller handlers"
```

---

## Task 6: Routes

**Files:**
- Modify: `apps/server/src/modules/reproduction/presentation/routes.ts`

- [ ] **Step 1: Add insemination schema imports**

Add to the existing DTO imports:

```typescript
import {
  birthResponseSchema,
  createBirthSchema,
  createEstrusSchema,
  createInseminationSchema,
  createPregnancySchema,
  estrusResponseSchema,
  inseminationResponseSchema,
  pregnancyResponseSchema,
} from "./dtos/reproduction.dto";
```

- [ ] **Step 2: Add POST /reproduction/inseminations route**

Add after the `POST /reproduction/birth` route block:

```typescript
  app.post(
    "/reproduction/inseminations",
    {
      schema: {
        tags: ["Reproduction"],
        summary: "Create insemination record",
        description:
          "Register an insemination event for a female animal. Supports natural mating, artificial insemination, and embryo transfer. Links optionally to a male animal and tracks semen batch and outcome.",
        security: [{ bearerAuth: [] }],
        body: createInseminationSchema,
        response: {
          201: z.object({
            message: z.string(),
            insemination: inseminationResponseSchema,
          }),
        },
      },
    },
    reproductionController.createInsemination,
  );
```

- [ ] **Step 3: Add GET /reproduction/inseminations route**

Add after the POST route just created:

```typescript
  app.get(
    "/reproduction/inseminations",
    {
      schema: {
        tags: ["Reproduction"],
        summary: "Get insemination records",
        description:
          "Retrieve a paginated list of insemination records for the organization. Returns all registered insemination events sorted by date descending.",
        security: [{ bearerAuth: [] }],
        querystring: z.object({
          page: z.coerce.number().int().min(1).default(1),
          limit: z.coerce.number().int().min(1).max(100).default(20),
        }),
        response: {
          200: z.object({
            data: z.array(inseminationResponseSchema),
            meta: paginationMetaSchema,
          }),
        },
      },
    },
    reproductionController.getInseminations,
  );
```

- [ ] **Step 4: Update GET /reproduction/history/:animalId response schema**

Replace the `response` block for the history route to include inseminations:

```typescript
        response: {
          200: z.object({
            estrus: z.array(estrusResponseSchema),
            pregnancies: z.array(pregnancyResponseSchema),
            births: z.array(birthResponseSchema),
            inseminations: z.array(inseminationResponseSchema),
          }),
        },
```

- [ ] **Step 5: Commit**

```bash
git add apps/server/src/modules/reproduction/presentation/routes.ts
git commit -m "feat(reproduction): register insemination API routes"
```

---

## Task 7: Regenerate Frontend Hooks

- [ ] **Step 1: Ensure backend is running**

In a separate terminal, from the repo root:

```bash
yarn dev
```

Wait for `Server running at http://localhost:3333` in the output.

- [ ] **Step 2: Regenerate Kubb hooks**

```bash
cd apps/web && yarn generate
```

Expected: new files appear under `src/gen/hooks/reproductionController/`:
- `usePostV1ReproductionInseminations.ts`
- `useGetV1ReproductionInseminations.ts`

- [ ] **Step 3: Commit generated files**

```bash
git add apps/web/src/gen/
git commit -m "chore(web): regenerate API hooks with insemination endpoints"
```

---

## Task 8: InseminationForm Component

**Files:**
- Create: `apps/web/src/components/reproduction/insemination-form.tsx`

- [ ] **Step 1: Create the form component**

```tsx
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePostV1ReproductionInseminations } from '@/gen/hooks/reproductionController/usePostV1ReproductionInseminations'
import { getEnumLabel } from '@/lib/enum-labels'
import { AnimalSelect } from './animal-select'

const INSEMINATION_TYPES = [
  'NATURAL_MATING',
  'ARTIFICIAL_INSEMINATION',
  'EMBRYO_TRANSFER',
] as const

const INITIAL_FORM = {
  animalId: '',
  type: '' as (typeof INSEMINATION_TYPES)[number] | '',
  date: '',
  fatherId: '',
  semenBatch: '',
}

export function InseminationForm() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null)

  function showFeedback(ok: boolean, msg: string) {
    setFeedback({ ok, msg })
    setTimeout(() => setFeedback(null), 3000)
  }

  const mutation = usePostV1ReproductionInseminations({
    mutation: {
      onSuccess: () => {
        setForm(INITIAL_FORM)
        showFeedback(true, 'Inseminação registrada!')
      },
      onError: () => showFeedback(false, 'Erro ao registrar.'),
    },
  })

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Plus className="size-4" />
          Registrar Inseminação
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
            onValueChange={v => setForm({ ...form, type: v as (typeof INSEMINATION_TYPES)[number] })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {INSEMINATION_TYPES.map(t => (
                <SelectItem key={t} value={t}>
                  {getEnumLabel('inseminationType', t)}
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
          <Label>Touro / Doador (opcional)</Label>
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
          <p className={`text-sm ${feedback.ok ? 'text-primary' : 'text-destructive'}`}>
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
                type: form.type as (typeof INSEMINATION_TYPES)[number],
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
  )
}
```

- [ ] **Step 2: Check that `AnimalSelect` supports `maleOnly` prop**

Open `apps/web/src/components/reproduction/animal-select.tsx` and verify it accepts a `maleOnly` prop similar to `femaleOnly`. If not, add it following the same pattern as `femaleOnly`.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/reproduction/insemination-form.tsx
git commit -m "feat(web): add InseminationForm component"
```

---

## Task 9: InseminationView Component

**Files:**
- Create: `apps/web/src/components/reproduction/insemination-view.tsx`

- [ ] **Step 1: Create the list view component**

```tsx
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useGetV1ReproductionInseminations } from '@/gen/hooks/reproductionController/useGetV1ReproductionInseminations'
import { getEnumLabel } from '@/lib/enum-labels'

export function InseminationView() {
  const query = useGetV1ReproductionInseminations({ page: 1, limit: 20 })

  if (query.isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  const inseminations = query.data?.data ?? []
  const meta = query.data?.meta

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Inseminações Registradas</CardTitle>
      </CardHeader>
      <CardContent>
        {inseminations.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Nenhuma inseminação registrada.
          </p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Fêmea</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>Resultado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inseminations.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {new Date(item.date).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{item.animalId}</TableCell>
                    <TableCell>
                      {getEnumLabel('inseminationType', item.type)}
                    </TableCell>
                    <TableCell>{item.semenBatch ?? '—'}</TableCell>
                    <TableCell>
                      {item.success == null ? (
                        <span className="text-muted-foreground text-sm">—</span>
                      ) : (
                        <Badge variant={item.success ? 'default' : 'destructive'}>
                          {item.success ? 'Positivo' : 'Negativo'}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {meta && (
              <p className="text-xs text-muted-foreground mt-3 text-right">
                {meta.total} registro{meta.total !== 1 ? 's' : ''}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/components/reproduction/insemination-view.tsx
git commit -m "feat(web): add InseminationView component"
```

---

## Task 10: Add Insemination Tab to Reproduction Page

**Files:**
- Modify: `apps/web/src/routes/reproduction.tsx`

- [ ] **Step 1: Add imports**

Add to existing imports:

```tsx
import { InseminationForm } from '@/components/reproduction/insemination-form'
import { InseminationView } from '@/components/reproduction/insemination-view'
```

- [ ] **Step 2: Add tab trigger**

In `<TabsList>`, change `grid-cols-3` to `grid-cols-4` and add the new trigger:

```tsx
<TabsList className="w-full grid grid-cols-4 max-w-lg mx-auto mb-6">
  <TabsTrigger value="insemination">Inseminação</TabsTrigger>
  <TabsTrigger value="estrus">Estro / Cio</TabsTrigger>
  <TabsTrigger value="pregnancy">Gestação</TabsTrigger>
  <TabsTrigger value="birth">Partos</TabsTrigger>
</TabsList>
```

- [ ] **Step 3: Add tab content**

Add before the `estrus` `TabsContent`:

```tsx
<TabsContent value="insemination" className="mt-4 space-y-6">
  <div className="flex justify-center">
    <InseminationForm />
  </div>
  <InseminationView />
</TabsContent>
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/routes/reproduction.tsx
git commit -m "feat(web): add insemination tab to reproduction page"
```

---

## Task 11: Check AnimalSelect for maleOnly Support

**Files:**
- Modify (if needed): `apps/web/src/components/reproduction/animal-select.tsx`

- [ ] **Step 1: Read the current AnimalSelect implementation**

Open `apps/web/src/components/reproduction/animal-select.tsx`.

- [ ] **Step 2: Add `maleOnly` prop if missing**

If `maleOnly` prop does not exist, add it following the same pattern as `femaleOnly`. The filter should pass `sex: 'MALE'` to the animals query. Example diff:

```tsx
// Before:
interface AnimalSelectProps {
  value: string
  onChange: (value: string) => void
  femaleOnly?: boolean
}
// ...and the filter: sex: femaleOnly ? 'FEMALE' : undefined

// After:
interface AnimalSelectProps {
  value: string
  onChange: (value: string) => void
  femaleOnly?: boolean
  maleOnly?: boolean
}
// ...and the filter: sex: femaleOnly ? 'FEMALE' : maleOnly ? 'MALE' : undefined
```

- [ ] **Step 3: Commit (only if changed)**

```bash
git add apps/web/src/components/reproduction/animal-select.tsx
git commit -m "feat(web): add maleOnly prop to AnimalSelect"
```
