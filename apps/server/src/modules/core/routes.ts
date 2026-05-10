import type { FastifyInstance } from "fastify";
import animalRoutes from "./animals/animals.routes";
import breedRoutes from "./breeds/breeds.routes";
import enumRoutes from "./enums.routes";
import organizationRoutes from "./organizations/organizations.routes";
import userRoutes from "./users/users.routes";

export default async function coreRoutes(app: FastifyInstance) {
  app.register(animalRoutes);
  app.register(breedRoutes);
  app.register(organizationRoutes);
  app.register(userRoutes);
  app.register(enumRoutes);
}
