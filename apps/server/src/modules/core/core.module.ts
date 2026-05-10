import { PrismaService } from "@src/infrastructure/persistence/prisma.service";
import { AnimalController } from "./animals/animals.controller";
import { PrismaAnimalRepository } from "./animals/animals.repository";
import { AnimalService } from "./animals/animals.service";
import { BreedController } from "./breeds/breeds.controller";
import { PrismaBreedRepository } from "./breeds/breeds.repository";
import { BreedService } from "./breeds/breeds.service";
import { OrganizationController } from "./organizations/organizations.controller";
import { PrismaOrganizationRepository } from "./organizations/organizations.repository";
import { OrganizationService } from "./organizations/organizations.service";
import { UserController } from "./users/users.controller";
import { PrismaUserRepository } from "./users/users.repository";
import { UserService } from "./users/users.service";

const prisma = PrismaService.getInstance();

const animalRepo = new PrismaAnimalRepository(prisma);
const animalService = new AnimalService(animalRepo);
export const animalController = new AnimalController(animalService);

const breedRepo = new PrismaBreedRepository(prisma);
const breedService = new BreedService(breedRepo);
export const breedController = new BreedController(breedService);

const organizationRepo = new PrismaOrganizationRepository(prisma);
const organizationService = new OrganizationService(organizationRepo);
export const organizationController = new OrganizationController(
  organizationService,
);

const userRepo = new PrismaUserRepository(prisma);
const userService = new UserService(userRepo);
export const userController = new UserController(userService);
