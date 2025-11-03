import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class ErrorHandlerFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {}
}
