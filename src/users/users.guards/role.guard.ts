import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { sout, UsersServices } from '../users.service';
import { role_key } from 'src/auth/decorators/auth.decorator';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CurrentUser } from 'src/tests/current.user';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UsersServices,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gql = GqlExecutionContext.create(context);

    const requiredRoles = this.reflector.get<string[]>(
      role_key,
      context.getHandler(),
    );

    // sout(gql.getContext().req);
    const input = gql.getArgs()['createBookInput'];
    const headers = gql.getContext().req.headers.authorization.split(' ')[1];

    sout('this is token' + headers);
    CurrentUser(headers);
    // sout({ requiredRoles, userRole: input.role });

    if (!requiredRoles) return true;

    return requiredRoles.includes(input.role);
  }
}
