import { ConflictError } from "@src/common/errors/app-error";
import { Animal } from "@src/modules/core/domain/entities/animal.entity";
import type { IAnimalRepository } from "@src/modules/core/domain/repositories/animal.repository";
import type { CreateAnimalDTO } from "@src/modules/core/presentation/dtos/animal.dto";

export class CreateAnimalUseCase {
  constructor(private readonly animalRepository: IAnimalRepository) {}

  async execute(
    data: CreateAnimalDTO,
    organizationId: string,
  ): Promise<Animal> {
    const existing = await this.animalRepository.findByTag(
      data.tag,
      organizationId,
    );
    if (existing)
      throw new ConflictError(
        "Animal with this tag already exists in the organization",
      );

    const animal = Animal.create({ ...data, organizationId });
    return this.animalRepository.create(animal);
  }
}
