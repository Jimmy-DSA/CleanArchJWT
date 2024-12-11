import cors from "cors";
import express, { Express, Request, Response } from "express";
import { config } from "../config/environment";
import morgan from "morgan";

export interface IHttpServer {
  useRoute(path: string, handlers: any): void;
  listen(port: number, callback: () => void): void;
}

export class ExpressAdapter implements IHttpServer {
  private app: Express;

  constructor() {
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(morgan("dev"));
  }

  useRoute(path: string, handlers: any): void {
    this.app.use(path, handlers);
  }

  listen(port: number): void {
    console.log(`Server is running on http://localhost:${port}`);
    this.app.listen(port);
  }
}
