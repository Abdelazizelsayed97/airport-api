import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { permission_key } from 'permissions/decorators/permissions.decorator';
import { User } from 'users/entities/user.entity';
import { sout } from 'users/users.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    const user: User = ctx.req.user;

    console.log('this is permissions guard ' + user);

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      permission_key,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }
    if (!user || !user.role) {
      return false;
    }
    const userPermissions = user.role.permissions;
    sout('user permissions ' + userPermissions);
    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.includes(permission as any),
    );
    if (!hasPermission) {
      return false;
    }
    return true;
  }
}
