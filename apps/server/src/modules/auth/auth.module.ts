import { PrismaService } from "@src/infrastructure/persistence/prisma.service";
import { PrismaUserRepository } from "@src/modules/core/users/users.repository";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

const prisma = PrismaService.getInstance();
const userRepo = new PrismaUserRepository(prisma);
const authService = new AuthService(userRepo);

export const authController = new AuthController(authService);
