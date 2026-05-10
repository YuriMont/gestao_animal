import { ConflictError, UnauthorizedError } from "@src/common/errors/app-error";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { IUserRepository } from "../core/users/users.repository";
import type { LoginDTO, LoginResult, RegisterDTO } from "./auth.types";

const SALT_ROUNDS = 12;

export class AuthService {
  constructor(private readonly userRepo: IUserRepository) {}

  async login(data: LoginDTO): Promise<LoginResult> {
    const user = await this.userRepo.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not configured");

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
      },
      secret,
      { expiresIn: "24h" },
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationId: user.organizationId,
      },
    };
  }

  async register(data: RegisterDTO) {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) {
      throw new ConflictError("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    const user = await this.userRepo.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: data.role ?? "OPERATOR",
      organizationId: data.organizationId,
    } as any);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organizationId,
    };
  }
}
