import { ConflictError } from "@src/common/errors/app-error";
import { Breed } from "@src/modules/core/domain/entities/breed.entity";
import type { IBreedRepository } from "@src/modules/core/domain/repositories/breed.repository";
import type { CreateBreedDTO } from "@src/modules/core/presentation/dtos/breed.dto";

export class CreateBreedUseCase {
  constructor(private readonly breedRepository: IBreedRepository) {}

  async execute(data: CreateBreedDTO, organizationId: string): Promise<Breed> {
    const existing = await this.breedRepository.findByNameAndSpecies(
      data.name,
      data.species,
      organizationId,
    );
    if (existing)
      throw new ConflictError(
        "Breed with this name and species already exists in the organization",
      );

    const breed = Breed.create({ ...data, organizationId });
    return this.breedRepository.create(breed);
  }
}
