import type {
  Breed as PrismaBreed,
  PrismaClient,
  Species,
} from "@generated/prisma/client";
import { Breed } from "@src/modules/core/domain/entities/breed.entity";
import type {
  BreedFilters,
  IBreedRepository,
  PaginatedBreeds,
} from "@src/modules/core/domain/repositories/breed.repository";

function toEntity(b: PrismaBreed): Breed {
  return Breed.create(
    {
      name: b.name,
      species: b.species,
      organizationId: b.organizationId,
    },
    b.id,
  );
}

export class PrismaBreedRepository implements IBreedRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(breed: Breed): Promise<Breed> {
    const created = await this.prisma.breed.create({
      data: {
        name: breed.props.name,
        species: breed.props.species,
        organizationId: breed.props.organizationId,
      },
    });
    return toEntity(created);
  }

  async findById(id: string, organizationId: string): Promise<Breed | null> {
    const breed = await this.prisma.breed.findFirst({
      where: { id, organizationId },
    });
    return breed ? toEntity(breed) : null;
  }

  async findByNameAndSpecies(
    name: string,
    species: Species,
    organizationId: string,
  ): Promise<Breed | null> {
    const breed = await this.prisma.breed.findFirst({
      where: { name, species, organizationId },
    });
    return breed ? toEntity(breed) : null;
  }

  async listByOrganization(
    organizationId: string,
    filters: BreedFilters = {},
  ): Promise<PaginatedBreeds> {
    const { page = 1, limit = 20, species } = filters;
    const skip = (page - 1) * limit;

    const where = {
      organizationId,
      ...(species && { species }),
    };

    const [breeds, total] = await this.prisma.$transaction([
      this.prisma.breed.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      this.prisma.breed.count({ where }),
    ]);

    return {
      breeds: breeds.map(toEntity),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(breed: Breed): Promise<Breed> {
    const updated = await this.prisma.breed.update({
      where: { id: breed.id! },
      data: {
        name: breed.props.name,
        species: breed.props.species,
      },
    });
    return toEntity(updated);
  }

  async delete(id: string, organizationId: string): Promise<void> {
    await this.prisma.breed.delete({ where: { id, organizationId } });
  }
}
