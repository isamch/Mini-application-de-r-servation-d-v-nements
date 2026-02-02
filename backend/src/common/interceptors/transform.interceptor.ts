import {
Injectable,
NestInterceptor,
ExecutionContext,
CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
data: T;
}

/**
* Transform Interceptor
*
* @description
* Wraps all successful responses in a consistent format with a 'data' property.
* This ensures all API responses follow the same structure.
*
* @example Before:
* ```json
* { "id": 1, "name": "John" }
* ```
*
* @example After:
* ```json
* {
* "data": {
* "id": 1,
* "name": "John"
* }
* }
* ```
*
* @workflow
* 1. Controller returns data
* 2. Interceptor wraps it in { data: ... }
* 3. Client receives formatted response
*
* @see https://docs.nestjs.com/interceptors
*/
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
    {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
    ): Observable<Response<T>> {
    return next.handle().pipe(map((data) => ({ data })));
  }
}