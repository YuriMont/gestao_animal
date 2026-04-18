# PRD — Animal Management API

**Versão:** 1.0  
**Status:** Em desenvolvimento  
**Autor:** Yuri Monteiro  
**Última atualização:** 2026-04-17

---

## 1. Visão geral

O **Animal Management API** é o backend de um sistema de gestão pecuária multi-tenant. Ele centraliza o controle de animais, saúde, reprodução, produção (leite e peso), finanças e alertas para fazendas e organizações agropecuárias.

O sistema é desenhado para ser usado por três perfis de usuário: **veterinários (VET)**, **gerentes (MANAGER)** e **operadores (OPERATOR)**, cada um com diferentes níveis de acesso às operações disponíveis.

---

## 2. Contexto e motivação

Produtores rurais gerenciam centenas ou milhares de animais com dados distribuídos em planilhas, cadernos e sistemas desconexos. Isso gera:

- Perda de histórico sanitário de animais
- Decisões reprodutivas baseadas em estimativas
- Dificuldade em calcular custo/retorno por animal
- Falta de alertas proativos (vacinas vencidas, prenhezes próximas do parto)

Este sistema resolve esses problemas com uma API centralizada, estruturada por organização (tenant), acessada por aplicativos mobile e web.

---

## 3. Objetivos do produto

| #   | Objetivo                                      | Métrica de sucesso                             |
| --- | --------------------------------------------- | ---------------------------------------------- |
| 1   | Centralizar o cadastro e histórico de animais | 100% dos animais com tag única registrada      |
| 2   | Rastrear saúde e vacinação                    | Histórico completo acessível por animal        |
| 3   | Controlar ciclos reprodutivos                 | Registro de estro, prenhez e parto             |
| 4   | Monitorar produção (peso e leite)             | Série temporal de métricas por animal          |
| 5   | Acompanhar finanças da fazenda                | Saldo = receitas − custos em tempo real        |
| 6   | Notificar eventos críticos                    | Regras de alerta configuráveis por organização |

---

## 4. Usuários e papéis

### 4.1 Papéis (Role)

| Role       | Descrição              | Permissões típicas                                                     |
| ---------- | ---------------------- | ---------------------------------------------------------------------- |
| `OPERATOR` | Operador de campo      | Registrar pesagens, leite, aplicar vacinas                             |
| `VET`      | Médico veterinário     | Tudo do OPERATOR + criar tratamentos, diagnósticos, registros de saúde |
| `MANAGER`  | Gerente / proprietário | Tudo do VET + gerenciar usuários, finanças, alertas, configurações     |

> **Nota de implementação:** os roles estão definidos no JWT e no banco. A autorização por role deve ser aplicada nos endpoints sensíveis via `authorize('MANAGER')` no preHandler da rota.

### 4.2 Tenant

Cada **Organização** é um tenant isolado. Todos os dados são particionados por `organizationId`. Um usuário pertence a exatamente uma organização.

---

## 5. Arquitetura técnica

### 5.1 Stack

| Camada         | Tecnologia           | Versão    |
| -------------- | -------------------- | --------- |
| Runtime        | Node.js              | LTS       |
| Framework      | Fastify              | 5.8.4     |
| Linguagem      | TypeScript           | 6.0.2     |
| Validação      | Zod                  | 4.3.6     |
| ORM            | Prisma               | 7.7.0     |
| Banco de dados | MongoDB              | 15+       |
| Autenticação   | JWT (`jsonwebtoken`) | —         |
| Hash de senha  | bcrypt               | 12 rounds |
| Docs           | Swagger + Scalar     | —         |
| Linting        | Biome                | 2.4.11    |

### 5.2 Princípios de arquitetura

O projeto segue **Clean Architecture** com separação em camadas:

```
presentation  →  application  →  domain  ←  infrastructure
(routes/dtos)    (use-cases)    (entities)   (repositories Prisma)
```

- **Domain**: entidades puras (sem dependência de Prisma ou framework)
- **Application**: casos de uso, orquestram entities + repositories
- **Infrastructure**: implementação concreta dos repositórios com Prisma
- **Presentation**: rotas Fastify, validação Zod, serialização de resposta

### 5.3 Segurança

- Autenticação via **JWT Bearer** (24h de expiração)
- Senhas hasheadas com **bcrypt** (12 salt rounds)
- **Rate limiting**: 100 req/min por IP globalmente
- **CORS** restrito — somente origens listadas em `ALLOWED_ORIGINS`
- Todo acesso aos dados filtra por `organizationId` (isolamento de tenant)
- Senha nunca retornada em nenhum endpoint

### 5.4 Multi-tenancy

```
JWT payload → { id, email, role, organizationId }
                                      ↓
                              request.tenantId
                                      ↓
                    WHERE organizationId = request.tenantId
```

---

## 6. Modelo de dados

### 6.1 Entidades principais

#### Organization

```
id, name, createdAt, updatedAt
Relações: users, animals, paddocks, healthRecords, vaccines, treatments,
          estrusCycles, pregnancies, births, weightRecords, milkProduction,
          financials, alertRules, notifications
```

#### User

```
id, email (único), password (hashed), name, role (VET|MANAGER|OPERATOR),
organizationId, createdAt, updatedAt
```

#### Animal

```
id, tag (único global), species, breed?, sex (Male|Female),
birthDate, origin?, status (Active|Sold|Deceased|Quarantine),
organizationId, createdAt, updatedAt

Relações: healthRecords, vaccines, treatments, estrusCycles,
          pregnancies, birthsAsMother, birthsAsFather,
          weightRecords, milkProduction
```

#### Paddock

```
id, name, area? (hectares), organizationId, createdAt, updatedAt
```

### 6.2 Entidades de saúde

#### HealthRecord

```
id, animalId, date, description, observation?, organizationId
```

#### Vaccine

```
id, animalId, vaccineName, doseNumber (default 1), dateAdministered,
nextDueDate?, organizationId
```

#### Treatment

```
id, animalId, diagnosis, medication, dosage?, startDate, endDate?,
organizationId
```

### 6.3 Entidades de reprodução

#### Estrus

```
id, animalId, startDate, endDate?, observation?, organizationId
```

#### Pregnancy

```
id, animalId, detectedDate, expectedDate?,
status (Confirmed|Lost|Born), organizationId
```

#### Birth

```
id, motherId, fatherId?, birthDate, offspringTag?, status, organizationId
```

### 6.4 Entidades de produção

#### WeightRecord

```
id, animalId, weight (kg), date, organizationId
```

#### MilkProduction

```
id, animalId, quantity, unit (L|kg), date, organizationId
```

### 6.5 Entidades financeiras e alertas

#### FinancialRecord

```
id, type (COST|REVENUE), category, amount, date, description?,
organizationId
```

#### AlertRule

```
id, name, condition (ex: "vaccine_overdue"), value?, organizationId
```

#### Notification

```
id, ruleId?, message, isRead (default false), organizationId
```

---

## 7. API — Endpoints

### 7.1 Autenticação (público)

| Método | Rota             | Descrição                       |
| ------ | ---------------- | ------------------------------- |
| `POST` | `/auth/login`    | Autentica e retorna JWT         |
| `POST` | `/auth/register` | Cria usuário em uma organização |

**Login — request:**

```json
{ "email": "vet@fazenda.com", "password": "minimo8chars" }
```

**Login — response:**

```json
{
  "token": "eyJ...",
  "user": {
    "id": "uuid",
    "email": "...",
    "name": "...",
    "role": "VET",
    "organizationId": "uuid"
  }
}
```

**Todas as rotas `/v1/*` exigem o header:**

```
Authorization: Bearer <token>
```

---

### 7.2 Animais (`/v1/animals`)

| Método   | Rota              | Descrição                 | Filtros/Params                                             |
| -------- | ----------------- | ------------------------- | ---------------------------------------------------------- |
| `POST`   | `/v1/animals`     | Cadastrar animal          | —                                                          |
| `GET`    | `/v1/animals`     | Listar animais (paginado) | `?status=Active&species=Cattle&sex=Female&page=1&limit=20` |
| `GET`    | `/v1/animals/:id` | Buscar animal por ID      | —                                                          |
| `PUT`    | `/v1/animals/:id` | Atualizar animal          | —                                                          |
| `DELETE` | `/v1/animals/:id` | Remover animal            | —                                                          |

**Campos do animal:**

| Campo       | Tipo     | Obrigatório | Valores aceitos                                            |
| ----------- | -------- | ----------- | ---------------------------------------------------------- |
| `tag`       | string   | sim         | Identificador único (brinco/chip)                          |
| `species`   | string   | sim         | Ex: `Cattle`, `Sheep`, `Goat`                              |
| `breed`     | string   | não         | Ex: `Nelore`, `Angus`                                      |
| `sex`       | enum     | sim         | `Male` \| `Female`                                         |
| `birthDate` | ISO date | sim         | —                                                          |
| `origin`    | string   | não         | Procedência                                                |
| `status`    | enum     | não         | `Active` (default) \| `Sold` \| `Deceased` \| `Quarantine` |

---

### 7.3 Organizações (`/v1/organizations`)

| Método   | Rota                    | Descrição                     |
| -------- | ----------------------- | ----------------------------- |
| `POST`   | `/v1/organizations`     | Criar organização (bootstrap) |
| `GET`    | `/v1/organizations`     | Listar organizações           |
| `GET`    | `/v1/organizations/:id` | Buscar por ID                 |
| `PUT`    | `/v1/organizations/:id` | Atualizar nome                |
| `DELETE` | `/v1/organizations/:id` | Remover organização (cascade) |

---

### 7.4 Usuários (`/v1/users`)

| Método   | Rota            | Descrição                                     |
| -------- | --------------- | --------------------------------------------- |
| `POST`   | `/v1/users`     | Criar usuário (alternativa ao /auth/register) |
| `GET`    | `/v1/users`     | Listar usuários da organização (paginado)     |
| `GET`    | `/v1/users/:id` | Buscar por ID                                 |
| `PUT`    | `/v1/users/:id` | Atualizar nome ou role                        |
| `DELETE` | `/v1/users/:id` | Remover usuário                               |

---

### 7.5 Saúde (`/v1/health`)

| Método | Rota                           | Descrição                             |
| ------ | ------------------------------ | ------------------------------------- |
| `POST` | `/v1/health/records`           | Criar registro de saúde               |
| `POST` | `/v1/health/vaccines`          | Registrar vacinação                   |
| `POST` | `/v1/health/treatments`        | Registrar tratamento                  |
| `GET`  | `/v1/health/history/:animalId` | Histórico completo de saúde do animal |

---

### 7.6 Reprodução (`/v1/reproduction`)

| Método | Rota                                 | Descrição                       |
| ------ | ------------------------------------ | ------------------------------- |
| `POST` | `/v1/reproduction/estrus`            | Registrar ciclo de estro        |
| `POST` | `/v1/reproduction/pregnancies`       | Registrar prenhez               |
| `POST` | `/v1/reproduction/birth`             | Registrar parto                 |
| `GET`  | `/v1/reproduction/pregnancies`       | Listar prenhezes                |
| `GET`  | `/v1/reproduction/history/:animalId` | Histórico reprodutivo do animal |

---

### 7.7 Produção (`/v1/production`)

| Método | Rota                               | Descrição                      |
| ------ | ---------------------------------- | ------------------------------ |
| `POST` | `/v1/production/weight`            | Registrar pesagem              |
| `POST` | `/v1/production/milk`              | Registrar produção de leite    |
| `GET`  | `/v1/production/metrics/:animalId` | Métricas de produção do animal |

---

### 7.8 Financeiro (`/v1/financial`)

| Método | Rota                    | Descrição                        |
| ------ | ----------------------- | -------------------------------- |
| `POST` | `/v1/financial/records` | Criar lançamento financeiro      |
| `GET`  | `/v1/financial/records` | Listar lançamentos               |
| `GET`  | `/v1/financial/summary` | Resumo: receitas, custos e saldo |

**Campos do lançamento:**

| Campo         | Tipo     | Valores                                   |
| ------------- | -------- | ----------------------------------------- |
| `type`        | enum     | `COST` \| `REVENUE`                       |
| `category`    | string   | Ex: `Feed`, `Medicine`, `Sale`, `Service` |
| `amount`      | number   | Valor em reais                            |
| `date`        | ISO date | Data do lançamento                        |
| `description` | string?  | Observação                                |

---

### 7.9 Alertas (`/v1/alerts`)

| Método | Rota               | Descrição             |
| ------ | ------------------ | --------------------- |
| `POST` | `/v1/alerts/rules` | Criar regra de alerta |
| `GET`  | `/v1/alerts/rules` | Listar regras         |

---

### 7.10 Sistema (público)

| Método | Rota    | Descrição                       |
| ------ | ------- | ------------------------------- |
| `GET`  | `/`     | Health check                    |
| `GET`  | `/docs` | Documentação Swagger interativa |

---

## 8. Fluxos principais

### 8.1 Onboarding de uma nova fazenda

```
1. POST /v1/organizations           → cria a organização, obtém organizationId
2. POST /auth/register              → cria o primeiro usuário MANAGER com o organizationId
3. POST /auth/login                 → obtém JWT
4. POST /v1/animals (N vezes)       → cadastra o rebanho
```

### 8.2 Ciclo reprodutivo completo

```
1. POST /v1/reproduction/estrus     → registra estro da fêmea
2. POST /v1/reproduction/pregnancies → confirma prenhez (animalId = fêmea)
3. POST /v1/reproduction/birth      → registra o parto (motherId, fatherId?, offspringTag)
4. POST /v1/animals                 → cadastra a cria como novo animal
```

### 8.3 Acompanhamento sanitário

```
1. POST /v1/health/vaccines         → aplica vacina, define nextDueDate
2. POST /v1/health/treatments       → abre tratamento com diagnóstico
3. PUT  /v1/health/treatments/:id   → encerra tratamento (endDate)
4. GET  /v1/health/history/:animalId → visualiza histórico completo
```

### 8.4 Controle financeiro mensal

```
1. POST /v1/financial/records (tipo COST)    → lançamentos de custos (ração, mão de obra)
2. POST /v1/financial/records (tipo REVENUE) → lançamentos de receitas (venda de leite, animais)
3. GET  /v1/financial/summary                → obtém saldo do período
```

---

## 9. Paginação padrão

Todos os endpoints de listagem seguem o padrão:

**Request:** `GET /v1/animals?page=1&limit=20`

**Response:**

```json
{
  "data": [ { "id": "...", ... } ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

Limites: `page >= 1`, `1 <= limit <= 100`.

---

## 10. Tratamento de erros

| HTTP Status                 | Significado                                         |
| --------------------------- | --------------------------------------------------- |
| `400 Bad Request`           | Dados de entrada inválidos (falha na validação Zod) |
| `401 Unauthorized`          | Token ausente, malformado ou expirado               |
| `403 Forbidden`             | Token válido, mas role insuficiente                 |
| `404 Not Found`             | Recurso não encontrado (ou fora do tenant)          |
| `409 Conflict`              | Conflito de unicidade (ex: tag de animal duplicada) |
| `429 Too Many Requests`     | Rate limit excedido (100 req/min)                   |
| `500 Internal Server Error` | Erro inesperado do servidor                         |

**Formato padrão de erro:**

```json
{
  "error": "NOT_FOUND",
  "message": "Animal not found"
}
```

---

## 11. Configuração do ambiente

### Variáveis obrigatórias

```bash
DATABASE_URL="mongodb://user:password@localhost:27017/gestao_animal?authSource=admin&retryWrites=true&w=majority"
JWT_SECRET="string-aleatória-longa-mínimo-32-caracteres"
```

### Variáveis opcionais

```bash
PORT=3333                          # padrão: 3333
NODE_ENV=development               # development | production
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"
```

### Setup inicial

```bash
# 1. Instalar dependências
yarn install

# 2. Configurar .env (copiar exemplo e preencher)
cp .env.example .env

# 3. Gerar Prisma Client
yarn prisma generate

# 4. Criar banco e aplicar migrations
yarn prisma migrate dev --name init

# 5. Iniciar em desenvolvimento
yarn run dev
```

---

## 12. O que ainda não está implementado (backlog)

### Alta prioridade

| #   | Feature                     | Descrição                                                                                      |
| --- | --------------------------- | ---------------------------------------------------------------------------------------------- |
| 1   | **RBAC granular**           | Endpoints sensíveis (DELETE, financeiro, usuários) precisam verificar `role` via `authorize()` |
| 2   | **Refresh token**           | Token de 24h sem renovação — implementar `/auth/refresh`                                       |
| 3   | **Testes automatizados**    | Nenhum teste existe — priorizar testes de integração nos use cases                             |
| 4   | **Soft delete**             | Animais e usuários são deletados permanentemente — implementar `deletedAt`                     |
| 5   | **GET/PUT/DELETE na saúde** | Módulo `health` tem apenas POST e GET de histórico; faltam update/delete                       |

### Média prioridade

| #   | Feature                                   | Descrição                                                                           |
| --- | ----------------------------------------- | ----------------------------------------------------------------------------------- |
| 6   | **Motor de alertas**                      | Tabela `AlertRule` existe mas não há job que avalie as regras e crie `Notification` |
| 7   | **Gestão de Paddocks**                    | Modelo `Paddock` existe no banco mas não tem rotas implementadas                    |
| 8   | **Troca de senha**                        | Não existe endpoint para o usuário alterar a própria senha                          |
| 9   | **Filtros avançados em saúde/reprodução** | Endpoints de listagem dos módulos secundários não têm query filters                 |
| 10  | **Exportação de dados**                   | CSV/PDF de relatórios financeiros e de produção                                     |

### Baixa prioridade

| #   | Feature                   | Descrição                                       |
| --- | ------------------------- | ----------------------------------------------- |
| 11  | **Upload de imagens**     | Fotos dos animais associadas ao cadastro        |
| 12  | **Audit log**             | Rastrear quem criou/alterou cada registro       |
| 13  | **Webhooks**              | Notificar sistemas externos em eventos críticos |
| 14  | **Dashboard de métricas** | Endpoint agregado com KPIs da fazenda           |

---

## 13. Decisões técnicas registradas

### Por que Fastify e não Express?

Fastify tem performance significativamente superior, suporte nativo a schemas JSON para validação e serialização, e um ecossistema de plugins bem mantido. O `fastify-type-provider-zod` integra Zod diretamente ao ciclo de vida das rotas.

### Por que bcrypt e não argon2?

bcrypt é amplamente suportado sem dependências nativas problemáticas no Windows (onde o projeto é desenvolvido). 12 rounds é o padrão recomendado para servidores de produção (equilíbrio entre segurança e tempo de resposta).

### Por que multi-tenant por `organizationId` e não por schema/banco separado?

Simplicidade de operação e custo. Isolamento por coluna é suficiente para o volume esperado. Migrar para schema-per-tenant exigiria mudanças significativas no Prisma e na infraestrutura.

### Por que JWT sem blacklist?

Simplicidade intencional para MVP. Em produção, implementar uma blacklist em Redis para suportar logout efetivo. Por enquanto, tokens expiram em 24h.

---

## 14. Estrutura de um PR / contribuição

1. **Branch**: `feat/<modulo>-<descricao>` ou `fix/<descricao>`
2. **Lint antes de abrir**: `yarn run lint`
3. **Schema changes**: sempre acompanhar com `yarn prisma db push`
4. **Checklist de segurança**: ver seção no CLAUDE.md
5. **Documentação**: atualizar este PRD se mudar o contrato da API
