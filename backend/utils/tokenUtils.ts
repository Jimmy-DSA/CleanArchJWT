import jwt from "jsonwebtoken";
import { config } from "../config/environment";

export class TokenUtils {
  static generateToken(userId: string, username: string): string {
    return jwt.sign({ id: userId, username }, config.SECRET_KEY, {
      expiresIn: config.TOKEN_EXPIRATION,
    });
  }

  static generateRefreshToken(userId: string, username: string): string {
    return jwt.sign({ userId, username }, config.SECRET_REFRESH_KEY);
  }

  static getTokenExpirationDate(): Date {
    const now = new Date();
    now.setSeconds(now.getSeconds() + config.TOKEN_EXPIRATION);
    return now;
  }
}
