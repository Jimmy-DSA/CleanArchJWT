import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/environment";
import { ReqUserData } from "../types/auth";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("token:", token);

  if (!token) {
    res.status(403).json({ error: "no token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.SECRET_KEY) as ReqUserData;
    console.log("decoded:", decoded);

    req.user = decoded; // saving authenticated user information in request user property
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({
        error: "token expired.",
      });
      return;
    }
    console.log(error);
    res.status(403).json({
      message: "invalid token.",
    });
  }
};
