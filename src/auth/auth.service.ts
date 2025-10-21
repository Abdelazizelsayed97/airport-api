import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/sign-up.input';
import { SignInDto } from './dto/sign-in.input';
import { Roles } from './decorators/auth.decorator';
import { UsersRoles } from '../enums/user.roles';
import { sout, UsersServices } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userService: UsersServices) {}

  async sighUp(createUserInput: SignUpDto): Promise<User> {
    console.log(createUserInput);
    return this.userService.createUser(createUserInput);
  }

  @Roles(UsersRoles.passenger, UsersRoles.staff, UsersRoles.admin)
  async signIn(input: SignInDto): Promise<User> {
    return this.userService.verifyUser(input);
  }
}
