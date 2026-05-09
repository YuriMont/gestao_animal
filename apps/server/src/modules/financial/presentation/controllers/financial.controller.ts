import { PrismaService } from "@src/infrastructure/persistence/prisma.service";
import { getEnumLabel } from "@src/modules/core/presentation/dtos/enums.dto";
import { FinancialRecord } from "@src/modules/financial/domain/entities/financial-record.entity";
import { PrismaFinancialRepository } from "@src/modules/financial/infrastructure/persistence/financial.repository";
import type { CreateFinancialRecordDTO } from "@src/modules/financial/presentation/dtos/financial.dto";
import type { FastifyReply, FastifyRequest } from "fastify";

function mapFinancialResponse(record: any) {
  const props = record.props ? record.props : record;
  return {
    ...props,
    id: record.id,
    type: { key: props.type, label: getEnumLabel("financialType", props.type) },
    category: {
      key: props.category,
      label: getEnumLabel("financialCategory", props.category),
    },
  };
}

export const financialController = {
  async create(
    request: FastifyRequest<{ Body: CreateFinancialRecordDTO }>,
    reply: FastifyReply,
  ) {
    const tenantId = request.tenantId!;
    const repository = new PrismaFinancialRepository(
      PrismaService.getInstance(),
    );

    const record = await repository.create(
      FinancialRecord.create({
        ...request.body,
        date: request.body.date ?? new Date(),
        organizationId: tenantId,
      }),
    );
    return reply.status(201).send({
      message: "Financial record created",
      record: mapFinancialResponse(record),
    });
  },

  async getSummary(request: FastifyRequest, reply: FastifyReply) {
    const tenantId = request.tenantId!;
    const repository = new PrismaFinancialRepository(
      PrismaService.getInstance(),
    );
    const summary = await repository.getSummary(tenantId);
    return reply.send(summary);
  },

  async list(
    request: FastifyRequest<{ Querystring: { page: number; limit: number } }>,
    reply: FastifyReply,
  ) {
    const tenantId = request.tenantId!;
    const { page, limit } = request.query;
    const repository = new PrismaFinancialRepository(
      PrismaService.getInstance(),
    );
    const { records, total } = await repository.listByOrganization(
      tenantId,
      page,
      limit,
    );

    return reply.send({
      data: records.map(mapFinancialResponse),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  },
};
