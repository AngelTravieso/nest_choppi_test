import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StandardResponse } from '../interface/standard-response';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, StandardResponse<T>>
{
  private readonly logger = new Logger('HTTP_RESPONSE');

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<T>> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    const trackId = (req as any).trackId;

    return next.handle().pipe(
      map((data) => {
        const response: StandardResponse<T> = {
          status: res.statusCode,
          message: 'Success',
          data: data,
          date: new Date().toISOString(),
          trackId: trackId,
        };

        this.logger.log(
          `[${trackId}] <- ${res.statusCode} - Response: ${JSON.stringify(response.data)}`,
        );

        return response;
      }),
    );
  }
}
