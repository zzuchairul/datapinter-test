import { IHttpServer, RouteHandler } from '@infra/HttpServerShell';
import express, { Express, Request, Response, type NextFunction } from 'express';
import { rateLimit } from 'express-rate-limit';
import { Server } from 'http';


export class ExpressHttpServer implements IHttpServer {
  private app: Express;
  private server: Server | null = null;

  constructor() {
    // Create express app
    this.app = express();

    // Init Middleware
    this.app.use(express.json());

    // Rate Limitter
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 100,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      ipv6Subnet: 56,
    });
    this.app.use(limiter);

    // Check health
    this.app.get('/health', (_, res: Response) => {
      res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: Date.now(),
      });
    });
  }

  registerRoute(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', path: string, handler: RouteHandler, middleware?: Array<(req: Request, res: Response, next: NextFunction) => void>): void {
    const chain = middleware ? 
    [
      ...middleware, 
      (req: Request, res: Response, next: NextFunction) => Promise.resolve(handler(req, res)).catch(next)
    ] : [(req:  Request, res: Response, next: NextFunction) => Promise.resolve(handler(req, res)).catch(next)];
    (this.app as any)[method.toLowerCase()](path, ...chain);
  }

  registerMiddleware(middleware: any): void {
    this.app.use(middleware);
  }

  listen(port: number): Promise<void> {
    return new Promise((resolve) => {
      this.server = this.app.listen(port, () => {
        resolve();
      });
    });
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.server) return resolve();

      this.server.close((err?: Error) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}
