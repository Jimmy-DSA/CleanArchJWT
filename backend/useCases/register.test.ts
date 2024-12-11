import { Register } from "./register";
import {
  IUserRepository,
  UserRepository,
} from "../repositories/userRepository";

describe("Register Use Case", () => {
  let mockUserRepository: IUserRepository;
  let registerUseCase: Register;

  beforeEach(() => {
    mockUserRepository = new UserRepository();
    registerUseCase = new Register(mockUserRepository);
  });

  it("should register a new user", async () => {
    const username = "newuser";
    const password = "password123";

    const user = await registerUseCase.execute(username, password);

    expect(user).toBeDefined();
    expect(user.username).toBe(username);
  });

  it("should throw an error if username already exists", async () => {
    const username = "existinguser";
    const password = "password123";

    await registerUseCase.execute(username, password);

    await expect(registerUseCase.execute(username, password)).rejects.toThrow(
      "Username already exists."
    );
  });
});
