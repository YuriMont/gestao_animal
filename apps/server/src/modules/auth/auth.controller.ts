import type { FastifyReply, FastifyRequest } from "fastify";
import type { AuthService } from "./auth.service";
import type { LoginDTO, RegisterDTO } from "./auth.types";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (
    request: FastifyRequest<{ Body: LoginDTO }>,
    reply: FastifyReply,
  ) => {
    const result = await this.authService.login(request.body);
    return reply.status(200).send(result);
  };

  register = async (
    request: FastifyRequest<{ Body: RegisterDTO }>,
    reply: FastifyReply,
  ) => {
    const user = await this.authService.register(request.body);
    return reply
      .status(201)
      .send({ message: "User registered successfully", user });
  };
}
