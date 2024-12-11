import { IUserRepository } from "../repositories/userRepository";
import bcrypt from "bcryptjs";
import { TokenUtils } from "../utils/tokenUtils";
import { IRefreshTokenRepository } from "../repositories/refreshTokenRepository";

export class Login {
  constructor(
    private userRepository: IUserRepository,
    private refreshTokenRepo: IRefreshTokenRepository
  ) {}

  async execute(
    username: string,
    password: string
  ): Promise<{ token: string; refreshToken: string }> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new Error("User not found.");
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordValue);
    if (!passwordMatch) {
      throw new Error("Invalid password.");
    }

    const token = TokenUtils.generateToken(user.id!, user.username);
    const refreshToken = TokenUtils.generateRefreshToken(
      user.id!,
      user.username
    );

    await this.refreshTokenRepo.save(user.id!, refreshToken);

    return {
      token,
      refreshToken,
    };
  }
}
