# Animal Management API

Backend server for the Animal Management system, built with **Fastify**, **TypeScript**, and **Zod**.

## 🛠️ Tech Stack

- **Framework**: [Fastify](https://www.fastify.io/) (v5.8.4)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (6.0.2)
- **Validation**: [Zod](https://zod.dev/) (v4.3.6)
- **API Documentation**: [Swagger](https://swapi.dev/) & Scalar
- **Linting/Formatting**: [Biome](https://biomejs.app/) (v2.4.11)
- **Database**: [PostgreSQL](https://postgresql.org/) with Prisma (v7.7.0)

## 📁 Project Structure

```
src/
├── app.ts                    # App factory and global plugin registration
├── server.ts                 # Server entry point and listener
├── plugins/
│   ├── cors.ts              # CORS configuration
│   ├── errorHandler.ts      # Global error handling
│   ├── swagger.ts           # Swagger/OpenAPI configuration
│   └── auth.ts              # Authentication plugin (optional)
├── modules/
│   ├── core/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── animal.entity.ts
│   │   │   │   ├── organization.entity.ts
│   │   │   │   ├── user.entity.ts
│   │   │   │   └── ...
│   │   │   └── repositories/
│   │   │       ├── ...
│   │   │       └── ...
│   │   ├── infrastructure/
│   │   │   └── persistence/
│   │   │       ├── animal.repository.ts
│   │   │       ├── organization.repository.ts
│   │   │       └── user.repository.ts
│   │   ├── presentation/
│   │   │   ├── controllers/
│   │   │   │   ├── animal.controller.ts
│   │   │   │   ├── organization.controller.ts
│   │   │   │   ├── user.controller.ts
│   │   │   │   └── ...
│   │   │   └── dtos/
│   │   │       ├── ...
│   │   │       └── ...
│   │   └── routes.ts
│   ├── health/
│   │   ├── domain/
│   │   │   └── ...
│   │   ├── infrastructure/
│   │   │   └── persistence/
│   │   │       └── health.repository.ts
│   │   └── presentation/
│   │       ├── routes.ts
│   │       └── controllers/
│   │           └── ...
│   ├── reproduction/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── birth.entity.ts
│   │   │   │   ├── estrus.entity.ts
│   │   │   │   ├── pregnancy.entity.ts
│   │   │   │   └── ...
│   │   │   └── repositories/
│   │   │       └── reproduction.repository.ts
│   │   ├── infrastructure/
│   │   │   └── persistence/
│   │   │       └── reproduction.repository.ts
│   │   └── presentation/
│   │       ├── routes.ts
│   │       └── controllers/
│   │           └── ...
│   ├── production/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   ├── repositories/
│   │   │   └── ...
│   │   └── presentation/
│   │       ├── routes.ts
│   │       └── controllers/
│   │           └── ...
│   ├── financial/
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   │   └── persistence/
│   │   └── presentation/
│   │       ├── routes.ts
│   │       └── controllers/
│   │           └── ...
│   └── alerts/
│       ├── domain/
│       ├── infrastructure/
│       └── presentation/
│           ├── routes.ts
│           └── controllers/
│               └── ...
├── common/
│   └── middleware/
│       └── tenant-context.ts    # Tenant context middleware
├── types/
│   └── fastify.d.ts
└── scripts/
    └── ...
```

## 🏗️ Architecture Principles

### Modular Design
- Each domain has its own directory structure following Bounded Context patterns
- **presentation/**: Routes, controllers, DTOs (request/response contracts)
- **domain/**: Entities, repositories (business logic)
- **infrastructure/**: Database persistence layer

### Type Safety
- **Zod** for all input validation (request bodies, query params, response schemas)
- End-to-end type safety through type providers

### Request-Response Pattern
```typescript
// Routes define schemas and controllers
app.post('/animals', schema, controller)

// Controllers handle request/response flow
app.post('/animals', animalController.create)

// Service handles business logic (if using layered architecture)
```

## 🛠️ Getting Started

### Prerequisites
- Node.js (LTS recommended)
- PostgreSQL
- npm (v10+)

### Installation

#### 1. Clone the repository
```bash
cd /home/yuri-monteiro/Documentos/projetos/gestao_animal
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Configure database
```bash
npx prisma generate
npx prisma migrate dev --name init
```

#### 4. Set environment variables
```bash
cp server/.env.example server/.env
# Edit server/.env with your database credentials and configuration
```

### Development

**Start the development server with watch mode:**
```bash
npm run dev
```

The server will listen on `http://localhost:3333`

**Access API documentation:**
- Live Swagger UI: http://localhost:3333/docs
- Swagger UI: http://localhost:3333/docs (manual)

**Build for production:**
```bash
npm run build
npm start
```

**Code quality tools:**
- **Lint**: `npm run lint` (enables Biome)
- **Format**: `npm run format`
- **Build**: `npm run build`

## 🌐 API Documentation

### Base URL
`http://localhost:3333`

### OpenAPI/Swagger Spec
`http://localhost:3333/docs`

### Core API Endpoints

#### Create User
```http
POST /users
Content-Type: application/json
{x-tenant-id: string}

{
  "name": "string",
  "email": "string",
  "age": number?
}
```

**Response (201 Created):**
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "OPERATOR",
  "organizationId": "string"
}
```

#### Create Animal
```http
POST /animals
Content-Type: application/json
{x-tenant-id: string}

{
  "tag": "string",
  "species": "string",
  "breed": "string?",
  "sex": "string",
  "birthDate": "string",
  "origin": "string?",
  "status": "Active",
  "organizationId": "string"
}
```

**Response (201 Created):**
```json
{
  "id": "string",
  "tag": "string",
  "species": "string",
  "breed": "string?",
  "sex": "string",
  "birthDate": "string",
  "status": "Active",
  "organizationId": "string"
}
```

#### Create Organization
```http
POST /organizations
Content-Type: application/json
{x-tenant-id: string}

{
  "name": "string"
}
```

**Response (201 Created):**
```json
{
  "id": "string",
  "name": "string"
}
```

#### List Animals
```http
GET /animals
x-tenant-id: string
```

**Response:**
```json
{
  "animals": [
    {
      "id": "string",
      "tag": "string",
      "species": "string",
      "breed": "string?",
      "status": "Active",
      ...
    }
  ]
}
```

### Health Check
```http
GET /
```

**Response:**
```json
{
  "message": "Server is running!"
}
```

### Production Mode
Use `npm start` for production server deployment.

## 🔒 Security & Authentication

### Tenant Context
The server implements a tenant-based architecture where each organization is a separate "tenant".

- **Default Role**: `OPERATOR` (can be changed in schema)
- **Roles**: `VET`, `MANAGER`, `OPERATOR`
- **Organization ID**: Required in request headers (`x-tenant-id`) for API calls
- **Authentication**: Not implemented in this version (optional auth plugin exists)

### Role-Based Access Control
- Default role: `OPERATOR`
- Role hierarchy: `VET` < `MANAGER` < `OPERATOR` (for CRUD permissions)

## 📊 Database Schema (PostgreSQL)

### Core Entities

**Organization**
```prisma
model Organization {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  users         User[]
  animals       Animal[]
  paddocks      Paddock[]
  healthRecords HealthRecord[]
  vaccines      Vaccine[]
  treatments    Treatment[]
  estrusCycles  Estrus[]
  pregnancies   Pregnancy[]
  births        Birth[]
  weightRecords WeightRecord[]
  milkProduction MilkProduction[]
  financials    FinancialRecord[]
  alertRules    AlertRule[]
  notifications Notification[]
}
```

**User**
```prisma
model User {
  id             String   @id @default(uuid())
  email          String   @unique
  password       String
  name           String
  role           Role     @default(OPERATOR)
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@map("users")
}
```

**Animal**
```prisma
model Animal {
  id             String   @id @default(uuid())
  tag            String   @unique
  species        String   // e.g., Cattle, Sheep
  breed          String?
  sex            String
  birthDate      DateTime
  origin         String?
  status         String   // e.g., Active, Sold, Deceased
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  healthRecords  HealthRecord[]
  vaccines       Vaccine[]
  treatments     Treatment[]
  estrusCycles   Estrus[]
  pregnancies    Pregnancy[]
  birthsAsMother Birth[] @relation("MotherToBirth")
  birthsAsFather Birth[] @relation("FatherToBirth")

  weightRecords  WeightRecord[]
  milkProduction MilkProduction[]
}
```

### Business Use Cases

1. **Create Organization**: `createOrganization.useCase()`
2. **Create User**: `createUser.useCase()`
3. **Create Animal**: `createAnimal.useCase()`
4. **Get Animals**: `getAnimals.useCase()`
5. **Get Organization**: `getOrganization.useCase()`

## ⚙️ Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| dev | `npm run dev` | Start development server with watch mode |
| build | `npm run build` | Compile TypeScript to JavaScript |
| start | `npm start` | Production server (no watch) |
| lint | `npm run lint` | Check and fix code style with Biome |
| format | `npm run format` | Format code style with Biome |
| db:generate | `npx prisma generate` | Regenerate Prisma client |
| db:migrate | `npx prisma migrate dev` | Run database migration |
| db:push | `npx prisma db push` | Push schema changes |

## 🔧 Configuration

### Environment Variables
Place `.env` in `server/` for configuration:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/animal_db"

# Server
PORT=3333
NODE_ENV=development

# JWT (if auth is enabled)
JWT_SECRET=your_secret_key
JWT_EXPIRE=86400000
```

### Biome Configuration
The project uses [Biome](https://biomejs.app/) for code quality. Run:
- `npm run lint` - Check code style
- `npm run format` - Reformat code

## 🚦 Common Use Cases

### Development Workflow
1. Start server: `npm run dev`
2. Make changes
3. Lint and format: `npm run lint && npm run format`
4. Run tests: `npm test`
5. Build for production: `npm run build`

### Testing
The project uses **Jest** for unit testing.

```bash
npm test
```

Tests can be run with flags:
- `-c`: Specific file
- `-x <pattern>`: Only specific test functions
- `--watch`: Run with watch mode (re-run on changes)

## 📦 Dependencies

### Production
- `fastify`: Web framework
- `pg`: Database client
- `zod`: Validation library
- `@scalar/fastify-api-reference`: API documentation
- `@fastify/swagger`: OpenAPI 3.0 support
- `@fastify/cors`: CORS configuration

### Development
- `tsx`: TypeScript compiler
- `typescript`: Type checker
- `prisma`: Database schema & client
- `dotenv`: Environment variables
- `@types/node`: Node.js type definitions

## 📝 Notes

- **Tenant-based architecture**: Every API call requires `x-tenant-id` header
- **Role-based access**: Default role is OPERATOR, can be VET or MANAGER
- **Validation-first**: Use Zod schemas for strict data validation
- **Modular design**: Follow presentation/domain/infrastructure separation
- **Type safety**: Full TypeScript coverage with Zod types
