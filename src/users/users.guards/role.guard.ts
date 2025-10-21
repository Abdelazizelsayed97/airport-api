import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { role_key } from '../../auth/decorators/auth.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gql = GqlExecutionContext.create(context);
    const ctx = gql.getContext();
    const args = gql.getArgs();

    const requiredRoles = this.reflector.get<string[]>(
      role_key,
      context.getHandler(),
    );

    if (!requiredRoles) return true;

    const user = ctx.req.user;
    if (!user) {
      return false;
    }

    // Allow access if the user is accessing their own data (generic "me" check)
    if (args.id === user.id || (args.input && args.input.userId === user.id)) {
      return true;
    }

    return requiredRoles.includes(user.role);
  }
}
