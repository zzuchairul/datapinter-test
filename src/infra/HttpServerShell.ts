import type { Request, Response } from "express";

export interface RouteHandler {
  (req: Request, res: Response): void | Promise<void>;
}

export interface IHttpServer {
  listen(port: number): Promise<void>;
  registerRoute(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    path: string,
    handler: RouteHandler
  ): void;
  close(): Promise<void>;
}
