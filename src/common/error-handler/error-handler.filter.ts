import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { isDev } from 'src/config/config.type';
import * as util from 'util';

export interface ExceptionResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  stack?: string;
  timestamp: string;
  path: string;
  correlationId?: string; // Optional for request tracing
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determine status and message
    const { status, exceptionResponse } = this.getExceptionDetails(exception);

    // Format the response
    const formattedResponse: ExceptionResponse = {
      statusCode: status,
      message: exceptionResponse.message,
      error: exceptionResponse.error,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Add stack trace in development mode
    if (isDev && exception instanceof Error) {
      formattedResponse.stack = exception.stack;
    }

    // Log the exception
    this.logException(exception, request);

    // Send response
    response.status(status).json(formattedResponse);
  }

  private getExceptionDetails(exception: unknown): {
    status: number;
    exceptionResponse: { message: string | string[]; error: string };
  } {
    // Handle HttpException (NestJS HTTP errors)
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const status = exception.getStatus();

      if (typeof response === 'string') {
        return {
          status,
          exceptionResponse: {
            message: response,
            error: HttpStatus[status] || 'Http Exception',
          },
        };
      }

      // If response is an object (NestJS default HttpException response)
      const responseObj = response as any;
      return {
        status,
        exceptionResponse: {
          message: responseObj.message || 'An error occurred',
          error: responseObj.error || HttpStatus[status] || 'Http Exception',
        },
      };
    }

    // Handle non-HTTP exceptions (TypeError, RangeError, custom errors, etc.)
    if (exception instanceof Error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        exceptionResponse: {
          message: isDev ? exception.message : 'Internal server error',
          error: exception.constructor.name || 'Internal Server Error',
        },
      };
    }

    // Handle unknown exceptions
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      exceptionResponse: {
        message: 'An unexpected error occurred',
        error: 'Internal Server Error',
      },
    };
  }

  private logException(exception: unknown, request: Request) {
    const errorDetails = {
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.url,
      body: request.body,
      query: request.query,
      params: request.params,
      user: (request as any).user, // If you have user authentication
      exception: isDev
        ? util.inspect(exception, { depth: 5 })
        : exception instanceof Error
          ? {
              name: exception.name,
              message: exception.message,
              stack: exception.stack,
            }
          : 'Unknown exception',
    };

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      if (status >= 500) {
        this.logger.error(
          `HTTP ${status} Error: ${exception.message}`,
          errorDetails,
        );
      } else {
        this.logger.warn(
          `HTTP ${status} Client Error: ${exception.message}`,
          errorDetails,
        );
      }
    } else {
      this.logger.error('Unhandled Exception', errorDetails);
    }
  }
}
