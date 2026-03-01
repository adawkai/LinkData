import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from '@/_shared/domain/errors';

@Catch(Error)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    const error = exception as DomainError;

    res.status(error.status).json({
      code: error.code,
      message: error.message,
    });
  }
}
