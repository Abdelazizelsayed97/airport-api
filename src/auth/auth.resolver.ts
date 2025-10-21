import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { SignUpDto } from './dto/sign-up.input';
import { SignInDto } from './dto/sign-in.input';
import { UsersRoles } from '../enums/user.roles';
import { Roles } from './decorators/auth.decorator';

@Resolver(() => User)
@Roles(UsersRoles.passenger, UsersRoles.staff)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User, { name: 'login' })
  signIn(@Args('loginInput') createAuthInput: SignInDto) {
    return this.authService.signIn(createAuthInput);
  }

  @Mutation(() => User, { name: 'register' })
  signUp(@Args('registerInput') createAuthInput: SignUpDto) {
    return this.authService.sighUp(createAuthInput);
  }
}
