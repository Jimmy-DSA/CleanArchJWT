import { User } from "../entities/User";
import { IUserRepository } from "../repositories/userRepository";

export class Register {
  constructor(private userRepository: IUserRepository) {}

  async execute(username: string, password: string): Promise<User> {
    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      console.log("Username already exists.");
      throw new Error("Username already exists.");
    } else {
      console.log("Username is available.");
    }

    const user = await User.create(username, password);
    const savedUser = await this.userRepository.save(user);
    return savedUser;
  }
}
