import { Module } from "@nestjs/common";
import { UserService } from "./users.service";
import { UserResolver } from "./users.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { RoleModule } from "role/role.module";
import { EmailModule } from "email/email.module";
import { FcmModule } from "fcm/fcm.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RoleModule,
    EmailModule,
    FcmModule,
  ],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
