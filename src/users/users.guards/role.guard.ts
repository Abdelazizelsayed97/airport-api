import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { role_key } from 'auth/decorators/auth.decorator';
import { sout } from 'users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlCtx = GqlExecutionContext.create(context);
    const request = gqlCtx.getContext().req;
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(role_key, [
      gqlCtx.getHandler(),
      gqlCtx.getClass(),
    ]);

    sout('6666666666666' + gqlCtx.getContext().req.user);
    sout('7777777777777' + gqlCtx.getContext().req);
    sout('--=-=-=-=-=-=-=--=-=-=' + context.switchToHttp().getRequest());
    if (!requiredRoles) {
      return true;
    }
    // sout('this is the request ' + request.user['id']);
    const user = JSON.stringify(request.user);
    sout('this is user ' + user);
    const hasRole = () => requiredRoles.includes(user['role']);
    if (user && hasRole()) {
      return true;
    }
    return true;
  }
}
