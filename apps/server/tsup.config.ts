import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  target: "node20",
  outDir: "dist",
  clean: true,
  dts: false,
  sourcemap: true,
  splitting: false,
  external: [
    "@prisma/client",
    "@prisma/adapter-pg",
    "pg",
    "bcrypt",
    "jsonwebtoken",
    "dotenv",
    "zod",
    "fastify",
    "@fastify/cors",
    "@fastify/rate-limit",
    "@fastify/swagger",
    "@scalar/fastify-api-reference",
    "fastify-type-provider-zod",
  ],
});
