import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
// implement permissions guard to check each role permissions

export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext().req;
    const role = ctx.role;
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!requiredPermissions) {
      return true;
    }
    if (!role) {
      return false;
    }
    const userPermissions = role.permissions;
    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );
    if (!hasPermission) {
      return false;
    }
    return true;
  }
}
