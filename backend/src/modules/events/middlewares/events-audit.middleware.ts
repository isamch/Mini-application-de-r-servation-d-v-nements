import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Events Audit Middleware
 * Logs all events related operations for audit purposes
 */
@Injectable()
export class EventsAuditMiddleware implements NestMiddleware {
  private readonly logger = new Logger(EventsAuditMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('User-Agent') || '';
    const userId = (req as any).user?.id || 'anonymous';

    // Log the request
    this.logger.log(
      `Events Action: ${method} ${originalUrl} - User: ${userId} - IP: ${ip} - UserAgent: ${userAgent}`,
    );

    // Log response when finished
    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(
        `Events Response: ${method} ${originalUrl} - Status: ${statusCode} - User: ${userId}`,
      );
    });

    next();
  }
}
