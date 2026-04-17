import { PrismaService } from "@src/infrastructure/persistence/prisma.service";
import { MilkProduction } from "@src/modules/production/domain/entities/milk-production.entity";
import { WeightRecord } from "@src/modules/production/domain/entities/weight-record.entity";
import { PrismaProductionRepository } from "@src/modules/production/infrastructure/persistence/production.repository";
import type { FastifyReply, FastifyRequest } from "fastify";

export const productionController = {
	async recordWeight(request: FastifyRequest, reply: FastifyReply) {
		const tenantId = request.tenantId;
		const repository = new PrismaProductionRepository(
			PrismaService.getInstance(),
		);

		try {
			const record = await repository.createWeight(
				WeightRecord.create({
					...(request.body as any),
					date: (request.body as any).date || new Date(),
					organizationId: tenantId!,
				}),
			);
			return reply.status(201).send({ message: "Weight recorded", record });
		} catch (error: any) {
			return reply
				.status(400)
				.send({ error: "Bad Request", message: error.message });
		}
	},

	async recordMilk(request: FastifyRequest, reply: FastifyReply) {
		const tenantId = request.tenantId;
		const repository = new PrismaProductionRepository(
			PrismaService.getInstance(),
		);

		try {
			const production = await repository.createMilk(
				MilkProduction.create({
					...(request.body as any),
					date: (request.body as any).date || new Date(),
					organizationId: tenantId!,
				}),
			);
			return reply
				.status(201)
				.send({ message: "Milk production recorded", production });
		} catch (error: any) {
			return reply
				.status(400)
				.send({ error: "Bad Request", message: error.message });
		}
	},

	async getMetrics(
		request: FastifyRequest<{ Params: { animalId: string } }>,
		reply: FastifyReply,
	) {
		const { animalId } = request.params;
		const tenantId = request.tenantId;
		const repository = new PrismaProductionRepository(
			PrismaService.getInstance(),
		);

		const metrics = await repository.getAnimalMetrics(animalId, tenantId!);
		return reply.send(metrics);
	},
};
