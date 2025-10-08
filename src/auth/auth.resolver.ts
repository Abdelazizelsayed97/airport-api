import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';
import { SignUpDto } from './dto/create-user.input';
import { SignInDto } from './dto/signin.dto';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User, { name: 'login' })
  signIn(@Args('createAuthInput') createAuthInput: SignInDto) {
    return this.authService.signIn();
  }

  @Mutation(() => User, { name: 'auth' })
  signUp(@Args('createAuthInput') createAuthInput: SignInDto) {
    return this.authService.signUp();
  }
}