import type { PrismaClient } from '@prisma/client';
import { Animal } from '@src/modules/core/domain/entities/animal.entity';
import type { IAnimalRepository } from '@src/modules/core/domain/repositories/animal.repository';

export class PrismaAnimalRepository implements IAnimalRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(animal: Animal): Promise<Animal> {
    const created = await this.prisma.animal.create({
      data: {
        tag: animal.props.tag,
        species: animal.props.species,
        breed: animal.props.breed ?? undefined,
        sex: animal.props.sex,
        birthDate: animal.props.birthDate,
        origin: animal.props.origin ?? undefined,
        status: animal.props.status,
        organizationId: animal.props.organizationId,
      },
    });

    return Animal.create({ ...animal.props }, created.id);
  }

  async findById(id: string, organizationId: string): Promise<Animal | null> {
    const animal = await this.prisma.animal.findFirst({
      where: { id, organizationId },
    });

    if (!animal) return null;

    return Animal.create(
      {
        tag: animal.tag,
        species: animal.species,
        breed: animal.breed ?? undefined,
        sex: animal.sex,
        birthDate: animal.birthDate,
        origin: animal.origin ?? undefined,
        status: animal.status,
        organizationId: animal.organizationId,
      },
      animal.id,
    );
  }

  async findByTag(tag: string, organizationId: string): Promise<Animal | null> {
    const animal = await this.prisma.animal.findFirst({
      where: { tag, organizationId },
    });

    if (!animal) return null;

    return Animal.create(
      {
        tag: animal.tag,
        species: animal.species,
        breed: animal.breed ?? undefined,
        sex: animal.sex,
        birthDate: animal.birthDate,
        origin: animal.origin ?? undefined,
        status: animal.status,
        organizationId: animal.organizationId,
      },
      animal.id,
    );
  }

  async listByOrganization(organizationId: string): Promise<Animal[]> {
    const animals = await this.prisma.animal.findMany({
      where: { organizationId },
    });

    return animals.map((a) =>
      Animal.create(
        {
          tag: a.tag,
          species: a.species,
          breed: a.breed ?? undefined,
          sex: a.sex,
          birthDate: a.birthDate,
          origin: a.origin ?? undefined,
          status: a.status,
          organizationId: a.organizationId,
        },
        a.id,
      ),
    );
  }

  async update(animal: Animal): Promise<Animal> {
    const updated = await this.prisma.animal.update({
      where: { id: animal.id! },
      data: {
        tag: animal.props.tag,
        species: animal.props.species,
        breed: animal.props.breed ?? undefined,
        sex: animal.props.sex,
        birthDate: animal.props.birthDate,
        origin: animal.props.origin ?? undefined,
        status: animal.props.status,
      },
    });

    return Animal.create({ ...animal.props }, updated.id);
  }

  async delete(id: string, organizationId: string): Promise<void> {
    await this.prisma.animal.delete({
      where: { id, organizationId },
    });
  }
}
