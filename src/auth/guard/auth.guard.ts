import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { sout } from 'users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlCtx = GqlExecutionContext.create(context);
    const request = gqlCtx.getContext().req;
    sout(request.headers.authorization);
    sout('================AuthGuard================' + request.user);

    if (request.headers.authorization === undefined) {
      return false;
    }

    const token = this.extractTokenFromHeader(request);
    sout(token);
    if (!token) {
      throw new UnauthorizedException();
    }
    sout(`this is secret ${process.env.JWT_SECRET}`);
    try {
      await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // request.user = payload;

      return true;
    } catch {
      throw new UnauthorizedException('something went wrong with token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
