import type {
  AnimalOrigin,
  AnimalSex,
  AnimalStatus,
  Species,
} from "@prisma/client";
import { NotFoundError } from "@src/common/errors/app-error";
import { Animal } from "@src/modules/core/domain/entities/animal.entity";
import type { IAnimalRepository } from "@src/modules/core/domain/repositories/animal.repository";

export interface UpdateAnimalData {
  tag?: string;
  species?: Species;
  breedId?: string;
  sex?: AnimalSex;
  birthDate?: Date;
  origin?: AnimalOrigin;
  status?: AnimalStatus;
}

export class UpdateAnimalUseCase {
  constructor(private readonly animalRepository: IAnimalRepository) {}

  async execute(
    id: string,
    organizationId: string,
    data: UpdateAnimalData,
  ): Promise<Animal> {
    const existing = await this.animalRepository.findById(id, organizationId);
    if (!existing) throw new NotFoundError("Animal");

    const updated = Animal.create(
      {
        tag: data.tag ?? existing.props.tag,
        species: data.species ?? existing.props.species,
        breedId: data.breedId ?? existing.props.breedId,
        sex: data.sex ?? existing.props.sex,
        birthDate: data.birthDate ?? existing.props.birthDate,
        origin: data.origin ?? existing.props.origin,
        status: data.status ?? existing.props.status,
        organizationId: existing.props.organizationId,
      },
      id,
    );

    return this.animalRepository.update(updated);
  }
}
