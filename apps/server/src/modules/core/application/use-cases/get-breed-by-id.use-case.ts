import { NotFoundError } from "@src/common/errors/app-error";
import type { Breed } from "@src/modules/core/domain/entities/breed.entity";
import type { IBreedRepository } from "@src/modules/core/domain/repositories/breed.repository";

export class GetBreedByIdUseCase {
  constructor(private readonly breedRepository: IBreedRepository) {}

  async execute(id: string, organizationId: string): Promise<Breed> {
    const breed = await this.breedRepository.findById(id, organizationId);
    if (!breed) throw new NotFoundError("Breed");
    return breed;
  }
}
