import type { Species } from "@generated/prisma/client";
import { ConflictError, NotFoundError } from "@src/common/errors/app-error";
import { Breed } from "@src/modules/core/domain/entities/breed.entity";
import type { IBreedRepository } from "@src/modules/core/domain/repositories/breed.repository";

export interface UpdateBreedData {
  name?: string;
  species?: Species;
}

export class UpdateBreedUseCase {
  constructor(private readonly breedRepository: IBreedRepository) {}

  async execute(
    id: string,
    organizationId: string,
    data: UpdateBreedData,
  ): Promise<Breed> {
    const existing = await this.breedRepository.findById(id, organizationId);
    if (!existing) throw new NotFoundError("Breed");

    const name = data.name ?? existing.props.name;
    const species = data.species ?? existing.props.species;

    const duplicate = await this.breedRepository.findByNameAndSpecies(
      name,
      species,
      organizationId,
    );
    if (duplicate && duplicate.id !== id)
      throw new ConflictError(
        "Breed with this name and species already exists in the organization",
      );

    const updated = Breed.create(
      {
        name,
        species,
        organizationId: existing.props.organizationId,
      },
      id,
    );

    return this.breedRepository.update(updated);
  }
}
