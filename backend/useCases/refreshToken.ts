import jwt from "jsonwebtoken";
import { config } from "../config/environment";
import { IRefreshTokenRepository } from "../repositories/refreshTokenRepository";
import { IUserRepository } from "../repositories/userRepository";
import { TokenUtils } from "../utils/tokenUtils";

export class RefreshToken {
  constructor(
    private refreshTokenRepo: IRefreshTokenRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(
    refreshToken: string
  ): Promise<{ token: string; refreshToken: string }> {
    const decoded = jwt.verify(refreshToken, config.SECRET_REFRESH_KEY) as {
      id: string;
      username: string;
    };

    const user = await this.userRepository.findByID(decoded.id);
    if (!user) {
      throw new Error("User not found.");
    }

    const savedRefreshToken = await this.refreshTokenRepo.findByUserId(
      decoded.id
    );
    if (savedRefreshToken !== refreshToken) {
      throw new Error("Invalid refresh token.");
    }

    const token = TokenUtils.generateToken(user.id!, user.username);
    const newRefreshToken = TokenUtils.generateRefreshToken(
      user.id!,
      user.username
    );

    await this.refreshTokenRepo.save(user.id!, newRefreshToken);

    return {
      token,
      refreshToken: newRefreshToken,
    };
  }
}
