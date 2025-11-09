import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP_REQUEST');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;

    const trackId = uuidv4();

    (req as any).trackId = trackId;

    res.setHeader('X-Request-Id', trackId);

    this.logger.log(`[${trackId}] -> ${method} ${originalUrl} - IP: ${req.ip}`);

    next();
  }
}
