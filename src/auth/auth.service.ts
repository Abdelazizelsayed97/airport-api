import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/sign-up.input';
import { SignInDto } from './dto/sign-in.input';
import { Roles } from './decorators/auth.decorator';
import { UsersRoles } from 'src/enums/user.roles';
import { sout } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,

    private jwtService: JwtService,
  ) {}

  async sighUp(createUserInput: SignUpDto): Promise<User> {
    console.log(createUserInput);

    const isUserExist = await this.userRepository.findOne({
      where: { email: createUserInput.email },
      relations: ['bookingList'],
      loadRelationIds: true,
    });
    sout(isUserExist);
    if (isUserExist) {
      throw new Error('User already exists with this email');
    }
    const user = this.userRepository.create({
      ...createUserInput,
    });
    const generatedToken = this.jwtService.sign({user});
    user.token = generatedToken;

    sout(user);
    await this.userRepository.save(user);
    return user;
  }

  @Roles(UsersRoles.passenger, UsersRoles.staff, UsersRoles.admin)
  async signIn(input: SignInDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: input.email },
    });
    console.log(user);
    if (!user) {
      throw new Error("This user doesn't exist");
    }
    if (user.password !== input.password) {
      throw new Error('Invalid credentials');
    } else {
      return user;
    }
  }
}
