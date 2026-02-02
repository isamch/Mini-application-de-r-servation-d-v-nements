import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

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
  private readonly logger = new Logger('UserAudit');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, user, params, body } = req as any;
    const timestamp = new Date().toISOString();

// Log user modifications
  if (method === 'PATCH' || method === 'DELETE' || method === 'POST') {
    const action = method === 'PATCH' ? 'UPDATED' : method === 'DELETE' ? 'DELETED' : 'CREATED';
    const targetUserId = params.id || 'new';
    const actor = user?.email || 'anonymous';

    this.logger.log(
`[AUDIT] User ${actor} ${action} user ${targetUserId} at ${timestamp}`,
);

// You can also save to database here
// await this.auditService.create({
// actor: user?.id,
// action,
// resource: 'user',
// resourceId: targetUserId,
// timestamp,
// changes: body,
// });
  }

  next();
  }
}
