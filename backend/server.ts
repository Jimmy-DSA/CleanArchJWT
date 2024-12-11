import express from "express";
import { Express } from "express";
import bcrypt from "bcryptjs";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config/environment";
import { ReqUserData } from "./types/auth";
import authRoutes from "./routes/authRoutes";
import { userInterface } from "./types/user";
import { ExpressAdapter } from "./server/HttpServer";

declare module "express-serve-static-core" {
  interface Request {
    user?: ReqUserData;
  }
}

const server = new ExpressAdapter();

server.useRoute("/auth", authRoutes);

server.listen(config.PORT);
