import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { UpdateUserInput } from 'auth/dto/update-user.input';
import { UsersRoles } from 'enums/user.roles';
import PaginationInput from 'pagination/pagination.dto';
import { SignUpDto } from 'auth/dto/sign-up.input';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from 'auth/dto/sign-in.input';

@Injectable()
export class UsersServices {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,

    private jwtService: JwtService,
  ) {}

  async createUser(input: SignUpDto) {
    const isUserExist = await this.userRepository.findOne({
      where: { email: input.email },
      relations: ['bookingList'],
      loadRelationIds: true,
    });
    // sout(isUserExist);
    if (isUserExist) {
      throw new Error('User already exists with this email');
    }
    const user = this.userRepository.create({
      ...input,
    });
    sout(user);
    const tokenPayload = { id: user.id };
    const generatedToken = this.jwtService.sign(tokenPayload, {
      expiresIn: '7d',
    });
    user.token = generatedToken;

    sout(user);
    await this.userRepository.save(user);
    return user;
  }
  async verifyUser(input: SignInDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: input.email },
    });
    if (!user) {
      throw new Error("This user doesn't exist");
    }
    if (user.password !== input.password) {
      throw new Error('Invalid credentials');
    } else {
      const tokenPayload = { id: user.id };
      const token = this.jwtService.sign(tokenPayload, { expiresIn: '1h' });
      user.token = token;
      await this.userRepository.save(user);
      return user;
    }
  }

  async getAllUsers(pagination: PaginationInput): Promise<User[]> {
    return this.userRepository.find({
      take: pagination.limit,
      skip: (pagination.page - 1) * pagination.limit,
      where: { role: UsersRoles.passenger },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: ['bookingList'],
    });

    if (!user) {
      throw new Error("This user doesn't exist");
    }

    return user;
  }
  async getByRole(role: UsersRoles): Promise<User> {
    const user = await this.userRepository.findOne({ where: { role } });
    if (!user) {
      throw new Error("This user doesn't exist");
    }
    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error("This user doesn't exist");
    }
    Object.assign(user, updateUserInput);

    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<any> {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error("This user doesn't exist");
    }
    await this.userRepository.delete(id).then((/**res */) => {
      return {
        message: 'User deleted successfully',
      };
    });
  }
}

export function sout(parm: any) {
  console.log(parm);
}
