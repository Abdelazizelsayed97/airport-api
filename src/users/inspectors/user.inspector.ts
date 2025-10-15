import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { sout } from '../users.service';

export class BookingInspector implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const role = request.headers.role;
    if (    role) {
      request.role = role;
      sout('ytututtutituituo' + role);
    }
    return next.handle();
  }
}
