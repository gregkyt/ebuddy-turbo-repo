import { User, UpdateUserPayload } from "@repo/entities/user";
import { UserRepository } from "../repository/user";

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.getAllUsers();
  }

  async getUser(uid: string): Promise<User | undefined> {
    return await this.userRepository.getUser(uid);
  }

  async updateUser(uid: string, user: UpdateUserPayload): Promise<User | undefined> {
    return await this.userRepository.updateUser(uid, user);
  }
}
