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
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get GraphQL context
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

  private extractTokenFromHeader(request: any): string | undefined {
    if (!request || !request.headers) {
      console.log('No request or headers found');
      return undefined;
    }
    const authHeader =
      request.headers.authorization || request.headers['Authorization'];
    console.log('Auth Header:', authHeader);
    if (!authHeader) {
      return undefined;
    }
    const [type, token] = authHeader.split(' ');
    console.log('Type:', type);
    console.log('Token:', token);
    return type === 'Bearer' ? token : undefined;
  }
}
