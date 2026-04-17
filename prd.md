# PRD — Sistema de Gestão Animal

## Objetivo do produto

Plataforma web multi-tenant para gestão integrada de rebanhos, cobrindo saúde animal, reprodução, produção, finanças e alertas em uma única interface.

Usuários-alvo: produtores rurais, veterinários e operadores de fazenda.

---

## Stack técnica

| Camada | Tecnologia |
|--------|------------|
| Monorepo | Yarn Workspaces + Turbo |
| Backend | Fastify 5 + TypeScript + Zod |
| Banco | MongoDB via Prisma 7 |
| Auth | JWT + bcrypt |
| Frontend | React 19 + Vite 8 |
| Roteamento | TanStack Router (file-based) |
| Estado servidor | TanStack React Query 5 |
| Estado cliente | Jotai 2 |
| HTTP | Axios + interceptors |
| Estilos | Tailwind CSS 4 + shadcn/ui |
| Geração de código | Kubb 4 (OpenAPI → hooks/types) |
| Lint/format | Biome |

---

## Módulos funcionais

### 1. Autenticação e organizações

- Registro de organização + usuário administrador
- Login por email/senha → JWT
- Papéis: `MANAGER`, `VET`, `OPERATOR`
- Multi-tenancy: todos os dados isolados por `organizationId`

**Endpoints públicos:**
- `POST /auth/register`
- `POST /auth/login`

---

### 2. Gestão de animais

Cadastro e controle do rebanho.

**Campos principais:** tag de identificação, nome, espécie, raça, sexo, data de nascimento, status (ativo/vendido/morto), peso inicial, pasto/paddock.

**Endpoints:** CRUD completo em `/v1/animals`

---

### 3. Saúde animal

Histórico completo de saúde por animal.

**Sub-recursos:**
- **Registros de saúde** — diagnósticos, observações clínicas
- **Vacinas** — tipo, data, validade, lote
- **Tratamentos** — medicamento, dose, duração, veterinário responsável

**Endpoints:** `/v1/health/records`, `/v1/health/vaccines`, `/v1/health/treatments`, `/v1/health/history/:animalId`

---

### 4. Reprodução

Acompanhamento do ciclo reprodutivo.

**Sub-recursos:**
- **Estros** — data, tipo de detecção, fêmea
- **Gestações** — data de cobertura, pai (opcional), previsão de parto
- **Partos** — data, filhotes, mãe, pai

**Endpoints:** `/v1/reproduction/estrus`, `/v1/reproduction/pregnancies`, `/v1/reproduction/births`

---

### 5. Produção

Métricas de desempenho zootécnico.

**Sub-recursos:**
- **Peso** — histórico de pesagens por animal
- **Produção de leite** — volume diário por animal

**Endpoints:** `/v1/production/weight`, `/v1/production/milk`

---

### 6. Financeiro

Controle de entradas e saídas da propriedade.

**Campos:** tipo (receita/despesa), categoria, valor, data, descrição, animal associado (opcional).

**Endpoints:** CRUD em `/v1/financial` + endpoint de resumo/totais

---

### 7. Alertas e notificações

Sistema de regras automáticas para eventos importantes.

**Alertas típicos:** vencimento de vacina, previsão de parto, animal sem pesagem há X dias.

**Sub-recursos:**
- **Regras** — configuração da condição e limiar
- **Notificações** — alertas disparados, leitura/marcação

**Endpoints:** `/v1/alerts/rules`, `/v1/alerts/notifications`

---

## Arquitetura de dados

```
Organization
  └── User (MANAGER | VET | OPERATOR)
  └── Paddock
  └── Animal
        ├── HealthRecord
        ├── Vaccine
        ├── Treatment
        ├── Estrus
        ├── Pregnancy
        │     └── Birth (mãe + pai opcional)
        ├── WeightRecord
        └── MilkProduction
  └── FinancialRecord
  └── AlertRule
        └── Notification
```

Todo modelo possui `organizationId` para isolamento multi-tenant.

---

## Fluxo de autenticação

```
Login (POST /auth/login)
  → JWT { userId, organizationId, role }
  → Persiste em localStorage (Jotai atomWithStorage)
  → Axios interceptor injeta Authorization: Bearer em toda requisição
  → 401 → limpa localStorage, redireciona para /login
```

---

## Páginas da aplicação

| Rota | Propósito | Auth |
|------|-----------|------|
| `/login` | Login e registro | Pública |
| `/` | Dashboard com KPIs | Protegida |
| `/animals` | CRUD de animais | Protegida |
| `/health` | Registros de saúde | Protegida |
| `/reproduction` | Ciclo reprodutivo | Protegida |
| `/production` | Peso e leite | Protegida |
| `/financial` | Financeiro | Protegida |
| `/alerts` | Alertas e regras | Protegida |

---

## Fluxo de desenvolvimento

### Ciclo completo para nova funcionalidade

```
1. Backend: criar schema Zod → use case → controller → registrar rota
2. Backend: verificar no Swagger UI (localhost:3333/docs)
3. Frontend: yarn generate (regenera src/gen/ com novos hooks)
4. Frontend: criar/atualizar page em src/routes/ usando hooks gerados
```

### Ambiente local

```bash
# 1. Instalar dependências
yarn install

# 2. Configurar .env em apps/server e apps/web

# 3. Inicializar banco
cd apps/server && yarn prisma db push

# 4. Subir tudo
cd ../.. && yarn dev
# Backend:  http://localhost:3333
# Docs API: http://localhost:3333/docs
# Frontend: http://localhost:5173
```

---

## Segurança

- Senhas: bcrypt (12 rounds)
- JWT com expiração configurável via `JWT_SECRET`
- CORS restrito a origens configuradas em `ALLOWED_ORIGINS`
- Rate limit: 100 req/min por IP (global)
- Validação de entrada via Zod em todos os endpoints
- Queries filtradas por `organizationId` — um tenant jamais acessa dados de outro

---

## Decisões de design relevantes

**Por que MongoDB + Prisma?**
Schema flexível adequado à variabilidade de dados veterinários; Prisma fornece type-safety sem migrations obrigatórias.

**Por que Kubb?**
Elimina drift entre contrato de API e código frontend — mudanças no backend se propagam ao frontend via `yarn generate`, sem escrita manual de hooks/types.

**Por que Jotai para auth?**
Leve, sem Provider necessário, `atomWithStorage` resolve persistência em localStorage com uma linha.

**Por que Turbo?**
Cache de build e execução paralela em monorepo sem configuração complexa.
