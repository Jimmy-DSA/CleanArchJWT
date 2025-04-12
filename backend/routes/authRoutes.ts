import { Router, Request, Response } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { JSONUserRepo, UserRepository } from "../repositories/userRepository";
import { Register } from "../useCases/register";
import { TokenUtils } from "../utils/tokenUtils";
import { Login } from "../useCases/login";
import { RefreshTokenRepository } from "../repositories/refreshTokenRepository";
import { DeleteUser } from "../useCases/deleteUser";
import { RefreshToken } from "../useCases/refreshToken";
import { PrismaUserRepo } from "../repositories/MySqlUserRepository";

const router = Router();

const userRepository = new PrismaUserRepo();
const refreshTokenRepository = new RefreshTokenRepository();
const loginUseCase = new Login(userRepository, refreshTokenRepository);
const registerUseCase = new Register(userRepository);

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const { token, refreshToken } = await loginUseCase.execute(
      username,
      password
    );

    res.json({
      token,
      refreshToken,
      tokenExpiresAt: TokenUtils.getTokenExpirationDate(),
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(401).json({ message: "An unknown error occurred." });
    }
  }
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    await registerUseCase.execute(username, password);

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
});

router.delete(
  "/users/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const idToDel = req.params.id;
      const requesterId = req.user?.id;

      console.log("requesterId", requesterId);

      const deleteUser = new DeleteUser(userRepository);

      await deleteUser.execute(idToDel, requesterId!);
      res.status(200).json({
        message: "User deleted successfully.",
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }
);

router.post("/refresh", async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const refreshTokenUseCase = new RefreshToken(
      refreshTokenRepository,
      userRepository
    );
    const { token, refreshToken: newRefreshToken } =
      await refreshTokenUseCase.execute(refreshToken);

    res.json({
      token,
      refreshToken: newRefreshToken,
      tokenExpiresAt: TokenUtils.getTokenExpirationDate(),
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
});

router.get("/welcome", authMiddleware, (req: Request, res: Response) => {
  res.json({
    message: `Olá ${req.user?.username}, essa é uma rota protegida!`,
  });
});

export default router;
