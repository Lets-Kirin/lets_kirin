import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseDto } from './dto/response.dto';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseDto> {
    return next.handle().pipe(
      map((response) => {
        if (response instanceof ResponseDto) {
          return response;
        }

        return new ResponseDto(
          true,
          'ok',
          response,
          context.switchToHttp().getResponse().statusCode,
        );
      }),
    );
  }
}
