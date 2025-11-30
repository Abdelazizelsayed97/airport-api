import { Injectable, Scope, UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Timestamp } from "typeorm";
import { User } from "./entities/user.entity";
import { UpdateUserInput } from "auth/dto/update-user.input";
import { UsersRoles } from "@core/enums/user.roles";
import PaginationInput from "pagination/pagination.dto";
import { RegisterInput } from "auth/dto/sign-up.input";
import { JwtService } from "@nestjs/jwt";
import { SignInDto } from "auth/dto/sign-in.input";
import { RoleService } from "role/role.service";
import { compare, hashSync } from "bcrypt";
import { action } from "@core/enums/permissions.action";
import { PermissionsD } from "permissions/decorators/permissions.decorator";
import { EmailService } from "email/email.service";
import { FcmService } from "fcm/fcm.service";
import { PermissionsGuard } from "permissions/guard/permissions.guard";

@Injectable({
  // scope: Scope.REQUEST,
})
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    readonly roleService: RoleService,
    private readonly emailService: EmailService,
    private readonly fcmTokenService: FcmService
  ) {}

  async createUser(input: RegisterInput) {
    const isUserExist = await this.userRepository.findOne({
      where: { email: input.email },
      // relations: ['bookingList'],
      // loadRelationIds: true,
    });

    if (isUserExist) {
      throw new Error("User already exists with this email");
    }
    const hashedPassword = hashSync(input.password, 10);
    input.password = hashedPassword;
    const user = this.userRepository.create({
      ...input,
      role: await this.roleService.findOne(input.role),
      createdAt: "3489758379",
    });

    user.token = await this.generateToken(user.id);

    const code = await this.sendNotificationToNewUserWithVerificationCode(user);

    user.verificationCode = code;

    await this.userRepository.save(user);
    await this.fcmTokenService.registerToken(user, {
      user_id: user.id,
      token: input.fcmToken,
      isActive: true,
    });
    return {
      ...user,
      message: "please verify your email to complete registration",
    };
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
      throw new Error("Invalid credentials");
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
      expiresIn: "1h",
      secret: process.env.JWT_SECRET,
    });
    return token;
  }

  @PermissionsD(UsersRoles.admin, action.create)
  @UseGuards(PermissionsGuard)
  async getAllUsers(pagination?: PaginationInput): Promise<User[]> {
    const users = await this.userRepository.find({
      take: pagination?.limit,
      skip: pagination ? ((pagination.page || 1) - 1) * pagination.limit : 0,
    });

    return users;
  }

  // @UseInterceptors(GraphqlResponseInspector)
  @PermissionsD(action.view_user)
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: ["bookingList", "role"],
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
    await this.userRepository.delete(id).then((res) => {
      return {
        res,
        message: "User deleted successfully",
      };
    });
  }
  async verifyUserEmail(userId: string, code: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("This user doesn't exist");
    }
    if (user.verificationCode !== code) {
      throw new Error("Invalid verification code");
    }

    return user;
  }
  private async sendNotificationToNewUserWithVerificationCode(user: User) {
    const codde = Math.floor(100000 + Math.random() * 900000).toString();

    await this.emailService.sendVerificationEmail(user, codde);

    return codde;
  }
}

// export function sout(parm: any) {
//   console.log(parm);
// }
