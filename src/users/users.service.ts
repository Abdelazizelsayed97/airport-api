import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserInput } from 'auth/dto/update-user.input';
import { UsersRoles } from '@core/enums/user.roles';
import PaginationInput from 'pagination/pagination.dto';
import { RegisterInput } from 'auth/dto/sign-up.input';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from 'auth/dto/sign-in.input';
import { RoleService } from 'role/role.service';
import { compare, hashSync } from 'bcrypt';
import { action } from '@core/enums/permissions.action';
import { PermissionsGuard } from 'permissions/guard/permissions.guard';

import { PermissionsD } from 'permissions/decorators/permissions.decorator';
import { EmailService } from 'email/email.service';

@Injectable()
export class UsersServices {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    readonly roleService: RoleService,
    // readonly firebaseServices: FirebaseService,
    private readonly emailService: EmailService,
  ) {}

  async createUser(input: RegisterInput) {
    const isUserExist = await this.userRepository.findOne({
      where: { email: input.email },
      // relations: ['bookingList'],
      // loadRelationIds: true,
    });

    if (isUserExist) {
      throw new Error('User already exists with this email');
    }
    const hashedPassword = hashSync(input.password, 10);
    input.password = hashedPassword;
    const user = this.userRepository.create({
      ...input,
      role: await this.roleService.findOne(input.role),
    });

    user.token = await this.generateToken(user.id);
    // await this.firebaseServices.sendNotification(user);
    const code = await this.sendNotificationToNewUserWithVerificationCode(user);
    user.verificationCode = code;
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
      user.role = await this.roleService.findByName(user.role.name);
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

  @PermissionsD(UsersRoles.admin, action.create)
  async getAllUsers(pagination: PaginationInput): Promise<User[]> {
    return this.userRepository.find({
      take: pagination.limit,
      // skip: (pagination.page || 0) * pagination.limit,
    });
  }
  // @UseInterceptors(GraphqlResponseInspector)
  @PermissionsD(action.view_user)
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: ['bookingList', 'role'],
      cache: true,
    });

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
  async verifyUserEmail() {}
  private async sendNotificationToNewUserWithVerificationCode(user: User) {
    const codde = Math.floor(100000 + Math.random() * 900000).toString();
    await this.emailService.sendVerificationEmail(user, codde);
    // You can store the code in the database or cache for later verification
    return codde;
  }
}

export function sout(parm: any) {
  console.log(parm);
}
