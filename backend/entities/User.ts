import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export interface IUser {
  id?: string;
  username: string;
  passwordValue: string;
}

export class User implements IUser {
  constructor(
    readonly id: string | undefined,
    public username: string,
    readonly passwordValue: string
  ) {}

  static async create(username: string, password: string): Promise<User> {
    if (!username) {
      throw new Error("Username is required.");
    }
    if (!password) {
      throw new Error("Password is required.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return new User(undefined, username, hashedPassword);
  }
}

export class UserTest implements IUser {
  constructor(
    readonly id: string,
    public username: string,
    public passwordValue: string
  ) {}

  static async create(
    username: string,
    password: string
  ): Promise<UserTest | undefined> {
    if (!username) {
      throw new Error("Username is required.");
    }
    if (!password) {
      throw new Error("Password is required.");
    }

    const id = randomUUID();

    const hashedPassword = await bcrypt.hash(password, 10);

    return new UserTest(id, username, hashedPassword);
  }
}
