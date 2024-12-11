export interface IRefreshTokenRepository {
  save(userId: string, refreshToken: string): Promise<void>;
  findByUserId(userId: string): Promise<string | undefined>;
}

export class RefreshTokenRepository implements IRefreshTokenRepository {
  private refreshTokens: { [key: string]: string } = {};

  async save(userId: string, refreshToken: string): Promise<void> {
    this.refreshTokens[userId] = refreshToken;
  }

  async findByUserId(userId: string): Promise<string | undefined> {
    return this.refreshTokens[userId];
  }
}
