import { NotFoundError } from "@src/common/errors/app-error";
import type { IBreedRepository } from "@src/modules/core/domain/repositories/breed.repository";

export class DeleteBreedUseCase {
  constructor(private readonly breedRepository: IBreedRepository) {}

  async execute(id: string, organizationId: string): Promise<void> {
    const existing = await this.breedRepository.findById(id, organizationId);
    if (!existing) throw new NotFoundError("Breed");
    await this.breedRepository.delete(id, organizationId);
  }
}
