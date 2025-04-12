import { IUserRepository } from "./userRepository";
import { User } from "../entities/User";

import { PrismaClient } from "../infrastructure/generated/prisma";

const prisma = new PrismaClient();

export class PrismaUserRepo implements IUserRepository {
  async findByID(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) return null;
    return new User(user.id, user.username, user.passwordValue);
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) return null;
    return new User(user.id, user.username, user.passwordValue);
  }

  async save(user: User): Promise<User> {
    await prisma.user.create({
      data: {
        username: user.username,
        passwordValue: user.passwordValue,
      },
    });
    return user;
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}
