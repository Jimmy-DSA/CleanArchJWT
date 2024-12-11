import { Login } from "./login";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/userRepository";
import { RefreshTokenRepository } from "../repositories/refreshTokenRepository";

import bcrypt from "bcryptjs";

describe("Login Use Case", () => {
  let mockUserRepository: UserRepository;
  let mockRefreshTokenRepository: RefreshTokenRepository;
  let loginUseCase: Login;

  beforeEach(() => {
    mockUserRepository = new UserRepository();
    mockRefreshTokenRepository = new RefreshTokenRepository();
    loginUseCase = new Login(mockUserRepository, mockRefreshTokenRepository);
  });

  it("should login a user with correct credentials", async () => {
    const username = "testuser";
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User("1", username, hashedPassword);

    await mockUserRepository.save(user);

    const result = await loginUseCase.execute(username, password);

    expect(result).toBeDefined();
    expect(result.token).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });

  it("should throw an error if user is not found", async () => {
    const username = "nonexistentuser";
    const password = "password123";

    await expect(loginUseCase.execute(username, password)).rejects.toThrow(
      "User not found."
    );
  });

  it("should throw an error if password is incorrect", async () => {
    const username = "testuser";
    const password = "password123";
    const wrongPassword = "wrongpassword";
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User("1", username, hashedPassword);

    await mockUserRepository.save(user);

    await expect(loginUseCase.execute(username, wrongPassword)).rejects.toThrow(
      "Invalid password."
    );
  });
});
