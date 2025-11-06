import { JwtService } from '@nestjs/jwt';
import { sout, UsersServices } from 'users/users.service';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class UserInspectorMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: JwtService,
    private readonly usersService: UsersServices,
  ) {}

  async use(req: any, res: any, next: () => void) {
    sout(
      'UserInspectorMiddleware headers: ' + JSON.stringify(req?.headers ?? {}),
    );

    const token = req.headers.authorization?.split(' ')[1];
    console.log('UserInspectorMiddleware token: ' + String(token ?? 'none'));

    if (token) {
      try {
        const payload: any = await this.authService.verifyAsync(token);
        const user = await this.usersService.findOne(payload.sub ?? payload.id);
        if (user) {
          req.user = user;
        }
      } catch (e) {
        console.warn(
          'UserInspectorMiddleware: Failed to attach user:',
          e?.message ?? e,
        );
      }
    }
    next();
  }
}
