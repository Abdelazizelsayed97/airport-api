import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { RegisterInput } from './dto/sign-up.input';
import { SignInDto } from './dto/sign-in.input';
import { UserService } from 'users/users.service';




@Injectable()
export class AuthService {
  constructor(readonly userService: UserService) {}

  async sighUp(registerInput: RegisterInput): Promise<User> {
    console.log(registerInput);

    return this.userService.createUser(registerInput);
  }

  async signIn(input: SignInDto): Promise<User> {
    return await this.userService.verifyUser(input);
  }
}
