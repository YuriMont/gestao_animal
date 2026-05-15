import type { ParasiteMonitoringRepository } from "./parasitology.repository";
import type {
  CreateParasiteMonitoringDTO,
  ListParasiteMonitoringQuery,
  ParasiteMonitoringRecord,
  UpdateParasiteMonitoringDTO,
} from "./parasitology.types";

export class ParasiteMonitoringService {
  constructor(private readonly repository: ParasiteMonitoringRepository) {}

  async create(
    data: CreateParasiteMonitoringDTO,
    organizationId: string,
  ): Promise<ParasiteMonitoringRecord> {
    return this.repository.create(data, organizationId);
  }

  async findById(
    id: string,
    organizationId: string,
  ): Promise<ParasiteMonitoringRecord | null> {
    return this.repository.findById(id, organizationId);
  }

  async update(
    id: string,
    data: UpdateParasiteMonitoringDTO,
    organizationId: string,
  ): Promise<ParasiteMonitoringRecord> {
    return this.repository.update(id, data, organizationId);
  }

  async delete(id: string, organizationId: string): Promise<void> {
    return this.repository.delete(id, organizationId);
  }

  async list(
    query: ListParasiteMonitoringQuery,
    organizationId: string,
  ): Promise<{
    data: ParasiteMonitoringRecord[];
    total: number;
  }> {
    return this.repository.list(query, organizationId);
  }

  async findByAnimalId(
    animalId: string,
    organizationId: string,
  ): Promise<ParasiteMonitoringRecord[]> {
    return this.repository.findByAnimalId(animalId, organizationId);
  }
}
