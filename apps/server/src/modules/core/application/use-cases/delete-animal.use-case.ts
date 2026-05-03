import { NotFoundError } from "@src/common/errors/app-error";
import type { IAnimalRepository } from "@src/modules/core/domain/repositories/animal.repository";

export class DeleteAnimalUseCase {
  constructor(private readonly animalRepository: IAnimalRepository) {}

  async execute(id: string, organizationId: string): Promise<void> {
    const existing = await this.animalRepository.findById(id, organizationId);
    if (!existing) throw new NotFoundError("Animal");
    await this.animalRepository.delete(id, organizationId);
  }
}
