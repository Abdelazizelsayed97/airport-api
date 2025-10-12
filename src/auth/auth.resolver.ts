import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';
import { SignUpDto } from './dto/sign-up.input';
import { SignInDto } from './dto/sign-in.input';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User, { name: 'login' })
  signIn(@Args('loginInput') createAuthInput: SignInDto) {
    return this.authService.signIn(createAuthInput);
  }

  @Mutation(() => User, { name: 'auth' })
  signUp(@Args('registerInput') createAuthInput: SignUpDto) {
    return this.authService.sighUp(createAuthInput);
  }
}
