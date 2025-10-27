import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { RegisterInput } from './dto/sign-up.input';
import { SignInDto } from './dto/sign-in.input';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User, { name: 'login' })
  signIn(@Args('loginInput') createAuthInput: SignInDto) {
    return this.authService.signIn(createAuthInput);
  }
  // @Roles(UsersRoles.user)
  // @UseGuards(RolesGuard)
  @Mutation(() => User, { name: 'register' })
  signUp(@Args('registerInput') registerInput: RegisterInput) {
    return this.authService.sighUp(registerInput);
  }
}
