# Claude Code Guide: Animal Management Server

This guide provides context for Claude Code to efficiently maintain and evolve the Animal Management API.

## 🏗 Architecture Principles

- **Modular Design**: Each domain (e.g., `users`) should have its own directory within `src/modules/` containing routes, controllers, and services.
- **Type Safety**: 
    - Always use Zod for request body, query, and response validation.
    - Leverage `ZodTypeProvider` for end-to-end type safety between schemas and controllers.
- **Separation of Concerns**:
    - `routes.ts`: Define endpoints and schemas.
    - `controller.ts`: Extract request data and call services.
    - `service.ts`: Implement business logic.

## 🛠 Workflow Guidelines

### Adding a New Module
1. Create a new folder in `src/modules/<module-name>`.
2. Implement the `service.ts` for business logic.
3. Implement the `controller.ts` to handle requests.
4. Define `routes.ts` with Zod schemas.
5. Register the routes in `src/app.ts`.

### Modifying Schemas
When changing a Zod schema in `routes.ts`, ensure that:
1. The `CreateUserDTO` or equivalent interface in `service.ts` is updated.
2. The controller logic handles any new optional/required fields.

## 📝 Common Commands
- `npm run dev`: Start development server.
- `npm run lint`: Check and fix code style with Biome.
- `npm run build`: Compile TypeScript to JavaScript.

## 🔍 Key Files
- `src/app.ts`: The central place for plugin registration and app configuration.
- `src/server.ts`: The entry point that starts the Fastify listener.
