import { inject, injectable } from "inversify";

import { IUserService } from "../interfaces/user.service.interface";
import { TYPES } from "../../../core/types";
import { User } from "../entities/user.entity";
import { NotFoundException } from "../../../core/exception";
import { IDatabaseService } from "../../../core/interfaces/database.service.interface";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.IDatabaseService)
    private readonly databaseService: IDatabaseService
  ) {}

  async getUserByEmail(email: string): Promise<User> {
    const userRepository = await this.databaseService.getRepository(User);

    const user = await userRepository.findOneBy({ email });

    if (!user) throw new NotFoundException("User not found");

    return user;
  }

  async getUserById(id: string): Promise<User> {
    const userRepository = await this.databaseService.getRepository(User);

    const user = await userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException("User not found");

    return user;
  }
}
