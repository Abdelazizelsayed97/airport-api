import { CanActivate, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";

export class IsVerifiedGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const qglCtx = GqlExecutionContext.create(context);
    const request = qglCtx.getContext().req;
    if (request.user.isVerified) {
      return true;
    }
    return false;
  }
}
