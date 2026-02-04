import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuditService } from '../../audit/services/audit.service';

/**
* User Audit Middleware
*
* @description
* Logs all user modification actions for audit trail.
* Tracks who modified what and when.
*
* @logs
* - User updates (PATCH)
* - User deletions (DELETE)
* - User creations (POST)
*
* @example Usage in module:
* ```typescript
* export class UsersModule implements NestModule {
* configure(consumer: MiddlewareConsumer) {
* consumer
* .apply(UserAuditMiddleware)
* .forRoutes(
* { path: 'users/:id', method: RequestMethod.PATCH },
* { path: 'users/:id', method: RequestMethod.DELETE },
* );
* }
* }
* ```
*
* @example Log output:
* ```
* [AUDIT] User john@example.com UPDATED user 123 at 2024-01-01T12:00:00Z
* ```
*/
@Injectable()
export class UserAuditMiddleware implements NestMiddleware {
  constructor(private readonly auditService: AuditService) { }

  private readonly logger = new Logger('UserAudit');

  async use(req: Request, res: Response, next: NextFunction) {
    const { method, url, user, params, body } = req as any;

    if (method === 'PATCH' || method === 'DELETE' || method === 'POST') {
      const action = method === 'PATCH' ? 'UPDATE_USER' : method === 'DELETE' ? 'DELETE_USER' : 'CREATE_USER';
      const targetUserId = params.id || 'new';
      const actor = user?.email || 'anonymous';

      this.logger.log(`[AUDIT] User ${actor} ${action} user ${targetUserId}`);

      try {
        await this.auditService.create({
          userId: user?.id || null,
          action: action,
          resource: 'USER',
          ipAddress: req.ip,
          userAgent: req.get('User-Agent') || '',
          changes: JSON.stringify(body || {}),
          method: method,
          url: req.originalUrl || req.url
        });
      } catch (error) {
        this.logger.error('Failed to create audit log:', error);
      }
    }

    next();
  }
}
