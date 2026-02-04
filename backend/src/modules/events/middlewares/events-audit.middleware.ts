import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuditService } from '../../audit/services/audit.service';

/**
 * Events Audit Middleware
 * Logs all events related operations for audit purposes
 */
@Injectable()
export class EventsAuditMiddleware implements NestMiddleware {
  private readonly logger = new Logger(EventsAuditMiddleware.name);

  constructor(private readonly auditService: AuditService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip, body, params } = req;
    const userAgent = req.get('User-Agent') || '';
    const userId = (req as any).user?.id || null;

    if (method === 'POST' || method === 'PATCH' || method === 'DELETE') {
      const action = method === 'POST' ? 'CREATE_EVENT' : method === 'PATCH' ? 'UPDATE_EVENT' : 'DELETE_EVENT';
      
      this.logger.log(`Events Action: ${method} ${originalUrl} - User: ${userId}`);

      try {
        await this.auditService.create({
          userId: userId,
          action: action,
          resource: 'EVENT',
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
