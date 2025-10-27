import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { sout } from '../users.service';

@Injectable()
export class BookingInspector implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const ctx = GqlExecutionContext.create(context);
    ctx.getContext().req.role = 'passenger';
    const request = ctx.getContext().req;
    const role = request.headers.role;
    if (role) {
      request.role = role;
    }
    return next.handle();
  }
}
