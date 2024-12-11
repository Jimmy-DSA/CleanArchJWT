import { IUserRepository } from "../repositories/userRepository";

export class DeleteUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(idToDel: string, requesterId: string): Promise<void> {
    if (!requesterId) {
      throw new Error("User ID missing in req params.");
    }
    if (!idToDel) {
      throw new Error("User ID to delete missing in url params.");
    }
    if (requesterId !== idToDel) {
      throw new Error("You can only delete your own account.");
    }
    await this.userRepository.delete(idToDel);
  }
}
