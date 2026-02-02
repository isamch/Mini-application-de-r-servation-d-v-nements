import {
ExceptionFilter,
Catch,
ArgumentsHost,
HttpException,
HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * HTTP Exception Filter
 *
 * @description
 * Global exception filter that catches all HTTP exceptions and formats them
 * into a consistent error response structure.
 *
 * @example Response format:
 * ```json
 * {
 *   "statusCode": 404,
 *   "timestamp": "2024-01-01T12:00:00.000Z",
 *   "path": "/api/users/999",
 *   "message": "User not found"
 * }
 * ```
 *
 * @workflow
 * 1. Catch HTTP exception
 * 2. Extract status code and error details
 * 3. Format error response with timestamp and path
 * 4. Send formatted response to client
 *
 * @see https://docs.nestjs.com/exception-filters
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Extract error message
    const error =
    typeof exceptionResponse === 'string'
        ? { message: exceptionResponse }
        : (exceptionResponse as object);

    // Send formatted error response
    response.status(status).json({
    statusCode: status,
    timestamp: new Date().toISOString(),
    path: request.url,
      ...error,
    });
  }
}