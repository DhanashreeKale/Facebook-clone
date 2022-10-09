import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Metadata } from '../dto/metadata';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformHeadersInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private configService: ConfigService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request: any = ctx.getRequest();

    return next.handle().pipe(
      map((data) => {
        if (this.configService.get('enableMetaData')) {
          const metadata = new Metadata();
          metadata.startTime = request._startTime.getTime();
          metadata.endTime = Date.now();
          metadata.apiProcessingTime =
            metadata.endTime - metadata.startTime + ' ms';
          return { data, metadata };
        } else {
          return data;
        }
      }),
    );
  }
}
