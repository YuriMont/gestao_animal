import type { Species } from "@generated/prisma/client";

export interface BreedProps {
  name: string;
  species: Species;
  organizationId: string;
}

export class Breed {
  constructor(
    public readonly props: BreedProps,
    public readonly id?: string,
  ) {}

  public static create(props: BreedProps, id?: string): Breed {
    if (!props.name) throw new Error("Breed name is required");
    return new Breed(props, id);
  }
}
