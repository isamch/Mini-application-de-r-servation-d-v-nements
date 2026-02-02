import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Bookings Audit Middleware
 * Logs all bookings related operations for audit purposes
 */
@Injectable()
export class BookingsAuditMiddleware implements NestMiddleware {
  private readonly logger = new Logger(BookingsAuditMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('User-Agent') || '';
    const userId = (req as any).user?.id || 'anonymous';

    // Log the request
    this.logger.log(
      `Bookings Action: ${method} ${originalUrl} - User: ${userId} - IP: ${ip} - UserAgent: ${userAgent}`,
    );

    // Log response when finished
    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(
        `Bookings Response: ${method} ${originalUrl} - Status: ${statusCode} - User: ${userId}`,
      );
    });

    next();
  }
}
