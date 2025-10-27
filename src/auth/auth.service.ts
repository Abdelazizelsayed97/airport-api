import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterInput } from './dto/sign-up.input';
import { SignInDto } from './dto/sign-in.input';
import { Roles } from './decorators/auth.decorator';
import { UsersRoles } from '../enums/user.roles';
import { sout, UsersServices } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(readonly userService: UsersServices) {}

  async sighUp(registerInput: RegisterInput): Promise<User> {
    console.log(registerInput);
    return this.userService.createUser(registerInput);
  }

  @Roles('passenger', 'staff', 'admin')
  async signIn(input: SignInDto): Promise<User> {
    return await this.userService.verifyUser(input);
  }
}
