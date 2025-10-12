import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthGuard } from './guard/roles.guard';
import { SignUpDto } from './dto/sign-up.input';
import { SignInDto } from './dto/sign-in.input';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  @UseGuards(AuthGuard)
  async sighUp(createUserInput: SignUpDto): Promise<User> {
    console.log(createUserInput);
    // const user = this.userRepository.create({
    //   ...(createUserInput.name && { name: createUserInput.name }),
    //   password: createUserInput.password,
    //   role: UserBasedRole.passenger,
    //   ...(createUserInput.passportNumber && {
    //     passportNumber: createUserInput.passportNumber,
    //   }),
    //   ...(createUserInput.email && { email: createUserInput.email }),
    // });
    const isUserExist = await this.userRepository.findOne({
      where: { email: createUserInput.email },
    });
    if (isUserExist) {
      throw new Error('User already exists with this email');
    }
    const user = this.userRepository.create(createUserInput);
    await this.userRepository.save(user);
    return user;
  }
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
