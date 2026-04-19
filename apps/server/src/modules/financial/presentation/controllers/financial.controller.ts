import { PrismaService } from "@src/infrastructure/persistence/prisma.service";
import { PrismaFinancialRepository } from "@src/modules/financial/infrastructure/persistence/financial.repository";
import type { CreateFinancialRecordDTO } from "@src/modules/financial/presentation/dtos/financial.dto";
import type { FastifyReply, FastifyRequest } from "fastify";

export const financialController = {
	async create(
		request: FastifyRequest<{ Body: CreateFinancialRecordDTO }>,
		reply: FastifyReply,
	) {
		const tenantId = request.tenantId;
		const repository = new PrismaFinancialRepository(
			PrismaService.getInstance(),
		);

		try {
			const record = await repository.create({
				...request.body,
				date: request.body.date || new Date(),
				organizationId: tenantId!,
			} as any);
			return reply
				.status(201)
				.send({ message: "Financial record created", record });
		} catch (error: any) {
			return reply
				.status(400)
				.send({ error: "Bad Request", message: error.message });
		}
	},

	async getSummary(request: FastifyRequest, reply: FastifyReply) {
		const tenantId = request.tenantId;
		const repository = new PrismaFinancialRepository(
			PrismaService.getInstance(),
		);
		const summary = await repository.getSummary(tenantId!);

		return reply.send(summary);
	},

	async list(request: FastifyRequest, reply: FastifyReply) {
		const tenantId = request.tenantId;
		const repository = new PrismaFinancialRepository(
			PrismaService.getInstance(),
		);
		const records = await repository.listByOrganization(tenantId!);
		return reply.send(records);
	},
};
