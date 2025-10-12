import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersRoles } from 'src/enums/user.roles';
import { User } from './entities/user.entity';
import PaginationInput from 'src/pagination/pagination.dto';
import { UpdateUserInput } from 'src/auth/dto/update-user.input';
import { AuthGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/auth.decorator';

@Injectable()
export class AuthServices {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  @Roles(UsersRoles.admin)
  @UseGuards(AuthGuard)
  async getAllUsers(pagination: PaginationInput): Promise<User[]> {
    return this.userRepository.find({
      take: pagination.limit,
      skip: (pagination.page - 1) * pagination.limit,
      where: { role: UsersRoles.passenger },
    });
  }
  @Roles(UsersRoles.admin, UsersRoles.staff)
  @UseGuards(AuthGuard)
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
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
