import { NotFoundError } from "@src/common/errors/app-error";
import { User } from "@src/modules/core/domain/entities/user.entity";
import type { IUserRepository } from "@src/modules/core/domain/repositories/user.repository";

export interface UpdateUserData {
	name?: string;
	role?: "VET" | "MANAGER" | "OPERATOR";
}

export class UpdateUserUseCase {
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(
		id: string,
		organizationId: string,
		data: UpdateUserData,
	): Promise<User> {
		const existing = await this.userRepository.findById(id);
		if (!existing || existing.props.organizationId !== organizationId) {
			throw new NotFoundError("User");
		}

		const updated = User.create(
			{
				email: existing.props.email,
				password: existing.props.password,
				name: data.name ?? existing.props.name,
				role: data.role ?? existing.props.role,
				organizationId: existing.props.organizationId,
			},
			id,
		);

		return this.userRepository.update(updated);
	}
}
