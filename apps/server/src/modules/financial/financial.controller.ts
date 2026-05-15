import { getEnumLabel } from "@src/common/lib/enums";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { FinancialService } from "./financial.service";
import type {
  CreateFinancialRecordDTO,
  UpdateFinancialRecordDTO,
} from "./financial.types";

function mapRecord(r: any) {
  return {
    ...r,
    type: { key: r.type, label: getEnumLabel("financialType", r.type) },
    category: {
      key: r.category,
      label: getEnumLabel("financialCategory", r.category),
    },
  };
}

export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  create = async (
    request: FastifyRequest<{ Body: CreateFinancialRecordDTO }>,
    reply: FastifyReply,
  ) => {
    const record = await this.financialService.create(
      request.body,
      request.tenantId!,
    );
    return reply
      .status(201)
      .send({ message: "Financial record created", record: mapRecord(record) });
  };

  list = async (
    request: FastifyRequest<{ Querystring: { page: number; limit: number } }>,
    reply: FastifyReply,
  ) => {
    const { page = 1, limit = 20 } = request.query;
    const result = await this.financialService.list(
      request.tenantId!,
      page,
      limit,
    );
    return reply.send({
      data: result.records.map(mapRecord),
      meta: {
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
      },
    });
  };

  getSummary = async (_request: FastifyRequest, reply: FastifyReply) => {
    const summary = await this.financialService.getSummary(_request.tenantId!);
    return reply.send(summary);
  };

  getById = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const record = await this.financialService.getById(
      request.params.id,
      request.tenantId!,
    );
    return reply.send(mapRecord(record));
  };

  update = async (
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateFinancialRecordDTO;
    }>,
    reply: FastifyReply,
  ) => {
    const record = await this.financialService.update(
      request.params.id,
      request.body,
      request.tenantId!,
    );
    return reply.send({
      message: "Financial record updated",
      record: mapRecord(record),
    });
  };

  delete = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    await this.financialService.delete(request.params.id, request.tenantId!);
    return reply.status(204).send();
  };
}
