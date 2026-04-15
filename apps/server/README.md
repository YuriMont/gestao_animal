# Animal Management API

This is the backend server for the Animal Management system, built with Fastify, TypeScript, and Zod.

## 🚀 Tech Stack

- **Framework**: [Fastify](https://www.fastify.io/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Validation**: [Zod](https://zod.dev/)
- **API Documentation**: [Scalar](https://scalar.com/) & Swagger
- **Linting/Formatting**: [Biome](https://biomejs.app/)

## 📁 Project Structure

The project follows a modular architecture:

```text
src/
├── app.ts             # App factory and global plugin registration
├── server.ts          # Server entry point and listener
├── modules/           # Domain-driven modules
│   └── users/         # User management module
│       ├── users.controller.ts  # Request handling logic
│       ├── users.routes.ts      # Route definitions and Zod schemas
│       └── users.service.ts     # Business logic and data persistence
└── plugins/           # Global Fastify plugins
    ├── cors.ts        # CORS configuration
    ├── errorHandler.ts # Global error handling
    └── swagger.ts     # Swagger/OpenAPI configuration
```

## 🛠 Getting Started

### Prerequisites
- Node.js (LTS recommended)
- npm

### Installation
```bash
npm install
```

### Development
Run the server in watch mode:
```bash
npm run dev
```

### Build & Production
```bash
npm run build
npm start
```

## 🔌 API Documentation

The API is self-documenting using Swagger and Scalar.
- **Documentation URL**: `http://localhost:3333/docs`

## 🚦 API Endpoints

### Users
- `POST /users`: Creates a new user.
    - **Body**: `{ name: string, email: string, age?: number }`
    - **Response**: `201 Created` with the created user object.

### Health Check
- `GET /`: Verifies if the server is running.

## 🛡 Validation & Error Handling

- **Input Validation**: Uses `fastify-type-provider-zod` for strict schema validation.
- **Error Handling**: A global error handler manages validation errors (400 Bad Request) and unexpected server errors.
