import { Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBasedRole } from 'src/enums/user.roles';
import { SignInDto } from 'src/auth/dto/signin.dto';
import { SignUpDto } from 'src/auth/dto/create-user.input';
import { User } from './entities/user.entity';
import PaginationInput from 'src/pagination/pagination.dto';
import { UpdateUserInput } from 'src/auth/dto/update-user.input';

@Injectable()
export class AuthServices {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
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

  async getAllUsers(pagination: PaginationInput): Promise<User[]> {
    return this.userRepository.find({
      take: pagination.limit,
      skip: (pagination.page - 1) * pagination.limit,
      where: { role: UserBasedRole.passenger },
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error("This user doesn't exist");
    }
    return user;
  }
  async getByRole(role: UserBasedRole): Promise<User> {
    const user = await this.userRepository.findOne({ where: { role } });
    if (!user) {
      throw new Error("This user doesn't exist");
    }
    return user;
  }
  async update(id: number, updateUserInput: UpdateUserInput) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error("This user doesn't exist");
    }
    return this.userRepository.update(id, updateUserInput);
  }

  async remove(id: number): Promise<any> {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error("This user doesn't exist");
    }
    await this.userRepository.delete(id).then((res) => {
      return {
        message: 'User deleted successfully',
      };
    });
  }
}
