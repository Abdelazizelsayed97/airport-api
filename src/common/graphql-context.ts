import { JwtService } from '@nestjs/jwt';
import { UsersServices } from 'users/users.service';
import { User } from 'users/entities/user.entity';

export async function createGraphQLContextCarringUserData(
  { req, res },
  jwtService: JwtService,
  usersService: UsersServices,
): Promise<{ req: any; res: any; user: User | null }> {
  let user: User | null = null;
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const [type, token] = authHeader.split(' ');
      if (type === 'Bearer' && token) {
        const payload = jwtService.verify(token);
        if (payload?.id) {
          user = await usersService.findOne(payload.id);
        }
      }
    }
  } catch (err) {
    console.warn('GraphQL context user fetch error:', err.message);
  }

  return { req, res, user };
}
