import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { logger } from '../config/app-logger.config';
import { RequestMetaService } from '../interceptors/request-meta.service';

//Reference : https://docs.nestjs.com/exception-filters

// eslint-disable-next-line @typescript-eslint/ban-types
const getCause = (response: string | object): [string] => {
  if (typeof response === 'string') return [response];
  else {
    const responseObject: any = response;
    return responseObject.message;
  }
};

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  constructor(private readonly requestMetaService: RequestMetaService) {}
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const requestMeta = await this.requestMetaService.getRequestMeta(request);
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let exceptionCause: [string];
    if (exception instanceof HttpException) {
      exceptionCause = getCause(exception.getResponse());
    } else {
      //console logs are not recommended but as of now logger does not configured to print stack trace, so kept it until this setup come in place
      console.error(exception, requestMeta);
      logger.error(exception, requestMeta);
      exceptionCause = ['Something went wrong.'];
    }
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      cause: exceptionCause,
    });
  }
}
