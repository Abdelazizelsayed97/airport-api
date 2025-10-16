import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersRoles } from 'src/enums/user.roles';
import { User } from './entities/user.entity';
import PaginationInput from 'src/pagination/pagination.dto';
import { UpdateUserInput } from 'src/auth/dto/update-user.input';
import { Roles } from 'src/auth/decorators/auth.decorator';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Injectable()
export class UsersServices {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

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
    // sout(user);
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
    return this.userRepository.update(id, updateUserInput);
  }

  async remove(id: string): Promise<any> {
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

export function sout(parm: any) {
  console.log(parm);
}
