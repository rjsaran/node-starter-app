import { User } from "../entities/user.entity";

export interface IUserService {
  getUserByEmail(email: string): Promise<User>;
  getUserById(id: string): Promise<User>;
}
