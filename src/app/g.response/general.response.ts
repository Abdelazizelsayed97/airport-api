import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface GeneralResponseIn<T> {
  data: T;
  message: string;
  statusCode: number;
}

export class GeneralResponse<T> implements NestInterceptor<T, GeneralResponseIn<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>
  ):
    | Observable<GeneralResponseIn<T>>
    | Promise<Observable<GeneralResponseIn<T>>> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: context.switchToHttp().getResponse().message,
        data: data,
      }))
    );
  }
}
  