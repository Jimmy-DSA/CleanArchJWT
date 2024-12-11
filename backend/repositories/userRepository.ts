import path from "path";
import fs from "fs/promises";
import { IUser, User } from "../entities/User";
import { randomUUID } from "crypto";

export interface IUserRepository {
  findByID(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}

export class UserRepository implements IUserRepository {
  private users: User[] = [];

  async findByID(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id);
    return user || null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = this.users.find((user) => user.username === username);
    return user || null;
  }

  async save(user: IUser): Promise<User> {
    const userWithId: User = new User(
      randomUUID(),
      user.username,
      user.passwordValue
    );
    this.users.push(userWithId);
    return userWithId;
  }

  async delete(id: string): Promise<void> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new Error("User not found.");
    }
    if (userIndex !== -1) {
      this.users.splice(userIndex, 1);
    }
  }
}

const filePath = path.resolve(__dirname, "../data/testUsers.json");

export class JSONUserRepo implements IUserRepository {
  async findByID(id: string): Promise<User | null> {
    const users = await this.readUsersFromFile();
    const user = users.find((user) => user.id === id);
    if (user) {
      return new User(user.id, user.username, user.passwordValue);
    }
    return null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const users = await this.readUsersFromFile();
    const user = users.find((user) => user.username === username);
    if (user) {
      return new User(user.id, user.username, user.passwordValue);
    }
    return null;
  }

  async save(user: IUser): Promise<User> {
    console.log("Saving user...");
    console.log(user);
    if (await this.findByUsername(user.username)) {
      throw new Error("Username already exists.");
    }
    if (!user.id) {
      user.id = randomUUID();
    }

    const users = await this.readUsersFromFile();
    users.push(user);
    await this.writeUsersToFile(users);
    return new User(user.id, user.username, user.passwordValue);
  }

  async delete(id: string): Promise<void> {
    const users = await this.readUsersFromFile();
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new Error("User not found.");
    }
    users.splice(userIndex, 1);
    await this.writeUsersToFile(users);
  }

  private async readUsersFromFile(): Promise<IUser[]> {
    try {
      await fs.access(filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        await fs.writeFile(filePath, "[]", "utf-8");
      } else {
        throw error;
      }
    }
    try {
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data) as IUser[];
    } catch (error) {
      throw error;
    }
  }

  private async writeUsersToFile(users: IUser[]): Promise<void> {
    await fs.writeFile(filePath, JSON.stringify(users, null, 2), "utf-8");
  }
}
