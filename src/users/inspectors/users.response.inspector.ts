import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, tap } from 'rxjs';

@Injectable()
export class GraphqlResponseInspector implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    const user = ctx.req?.user;

    const operationName = gqlCtx.getInfo().fieldName;
    const variables = gqlCtx.getArgs();

    const start = Date.now();

    return next.handle().pipe(
      tap((response) => {
        const duration = Date.now() - start;
        console.log(`🛰️ GraphQL Response Inspector:
         User: ${user?.email || 'Guest'}
         Operation: ${operationName}
         Duration: ${duration}ms
         Variables: ${JSON.stringify(variables)}
         Response: ${JSON.stringify(response, null, 2)}
         `);
        const { password, token, ...userr } = response;
        return userr;
      }),
    );
  }
}
