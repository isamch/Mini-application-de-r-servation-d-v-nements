import {
Injectable,
NestInterceptor,
ExecutionContext,
CallHandler,
Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
* Logging Interceptor
*
* @description
* Logs successful requests that pass through guards and reach controllers.
*
* ⚠️ LIMITATION: This interceptor only logs requests that pass authentication/authorization.
* Failed requests (401, 403) are NOT logged here.
*
* @recommendation
* Use LoggerMiddleware instead for comprehensive logging of ALL requests,
* including those that fail at the guard level.
*
* @example Output:
* ```
* GET /api/users 200 - 45ms
* ```
*
* @workflow
* 1. Request passes guards ✅
* 2. Interceptor starts timer
* 3. Controller processes request
* 4. Interceptor logs response with duration
*
* @see LoggerMiddleware - Recommended for complete request logging
* @see https://docs.nestjs.com/interceptors
*/
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    return next.handle().pipe(
  tap(() => {
    const response = context.switchToHttp().getResponse();
    const delay = Date.now() - now;
    this.logger.log(
`${method} ${url} ${response.statusCode} - ${delay}ms`,
);
}),
);
  }
}