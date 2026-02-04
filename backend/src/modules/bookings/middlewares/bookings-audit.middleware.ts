import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuditService } from '../../audit/services/audit.service';

/**
 * Bookings Audit Middleware
 * Logs all bookings related operations for audit purposes
 */
@Injectable()
export class BookingsAuditMiddleware implements NestMiddleware {
  private readonly logger = new Logger(BookingsAuditMiddleware.name);

  constructor(private readonly auditService: AuditService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip, body, params } = req;
    const userAgent = req.get('User-Agent') || '';
    const userId = (req as any).user?.id || null;

    if (method === 'POST' || method === 'PATCH' || method === 'DELETE') {
      const action = method === 'POST' ? 'CREATE_BOOKING' : method === 'PATCH' ? 'UPDATE_BOOKING' : 'CANCEL_BOOKING';
      
      this.logger.log(`Bookings Action: ${method} ${originalUrl} - User: ${userId}`);

      try {
        await this.auditService.create({
          userId: userId,
          action: action,
          resource: 'BOOKING',
          ipAddress: ip,
          userAgent: userAgent,
          changes: JSON.stringify(body || {}),
          method: method,
          url: originalUrl
        });
      } catch (error) {
        this.logger.error('Failed to create audit log:', error);
      }
    }

    next();
  }
}
