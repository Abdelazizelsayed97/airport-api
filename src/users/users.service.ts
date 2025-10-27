import { Injectable, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserInput } from 'auth/dto/update-user.input';
import { UsersRoles } from 'enums/user.roles';
import PaginationInput from 'pagination/pagination.dto';
import { RegisterInput } from 'auth/dto/sign-up.input';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from 'auth/dto/sign-in.input';
import { RoleService } from 'role/role.service';
import { compare, hashSync } from 'bcrypt';
import { GraphqlResponseInspector } from './inspectors/users.response.inspector';
import { UUID } from 'typeorm/driver/mongodb/bson.typings.js';

@Injectable()
export class UsersServices {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    readonly roleService: RoleService,
  ) {}

  async createUser(input: RegisterInput) {
    const isUserExist = await this.userRepository.findOne({
      where: { email: input.email },
      // relations: ['bookingList'],
      // loadRelationIds: true,
    });

    sout('hhhhhhhhhhhhh ' + isUserExist);
    if (isUserExist) {
      throw new Error('User already exists with this email');
    }
    const hashedPassword = hashSync(input.password, 10);
    input.password = hashedPassword;
    sout('createUser');
    const user = this.userRepository.create({
      ...input,
    });
    sout(user);

    user.token = await this.generateToken(user.id);
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
    const hashedPassword = hashSync(input.password, 10);
    if (await compare(hashedPassword, user.password)) {
      throw new Error('Invalid credentials');
    } else {
      user.token = await this.generateToken(user.id);
      await this.userRepository.save(user);
      return user;
    }
  }
  private async generateToken(user_id: string) {
    const tokenPayload = { id: user_id };
    const token = this.jwtService.sign(tokenPayload, {
      expiresIn: '1h',
      secret: process.env.JWT_SECRET,
    });
    return token;
  }

  async getAllUsers(pagination: PaginationInput): Promise<User[]> {
    return this.userRepository.find({
      take: pagination.limit,
      skip: (pagination.page || 0 - 1) * pagination.limit,
    });
  }
  // @UseInterceptors(GraphqlResponseInspector)
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
    const user = await this.userRepository.findOne({ where: { role: role } });
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
  private async seedAdmin() {
    const user = await this.userRepository.findOne({
      where: { email: 'super@admin.com' },
    });

    if (!user) {
      const admin = await this.userRepository.create({
        id: UUID.generate().buffer.toString(),
        name: 'AppAdmin',
        email: 'super@admin.com',
        password: 'AppAdmin1234',
        role: UsersRoles.super_admin,
        token: await this.generateToken(user!.id),
      });
      await this.userRepository.save(admin);
    }
  }
}

export function sout(parm: any) {
  console.log(parm);
}
