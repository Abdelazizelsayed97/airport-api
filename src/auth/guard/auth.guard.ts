import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext().req;

    console.log('Request exists:', !!request);
    console.log('Headers:', request?.headers);

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request['user'] = payload;
      return true;
    } catch (error) {
      console.error('Token verification failed:', error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: any): string {
    if (!request || !request.headers) {
      console.log('No request or headers found');

      throw new UnauthorizedException('No token provided');
    }
    const authHeader =
      request.headers.authorization || request.headers['Authorization'];
    console.log('Auth Header:', authHeader);
    if (!authHeader) {
      throw new UnauthorizedException();
    }
    const [type, token] = authHeader.split(' ');
    console.log('Type:', type);
    console.log('Token:', token);
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token format');
    }
    return token;
  }
}
