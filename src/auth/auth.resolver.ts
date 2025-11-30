import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { User } from "../users/entities/user.entity";
import { RegisterInput } from "./dto/sign-up.input";
import { SignInDto } from "./dto/sign-in.input";
import { UsersRoles } from "@core/enums/user.roles";
import { UseGuards } from "@nestjs/common";
import { RolesGuard } from "users/users.guards/role.guard";
import { Roles } from "./decorators/auth.decorator";
import { PermissionsD } from "permissions/decorators/permissions.decorator";
import { action } from "@core/enums/permissions.action";
import { UserInspectorMiddleware } from "@core/common/user-inspector-middleware";

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User, { name: "login" })
  signIn(@Args("loginInput") createAuthInput: SignInDto) {
    return this.authService.signIn(createAuthInput);
  }

  // @PermissionsD(UsersRoles.admin, UsersRoles.user)
  @Mutation(() => User, { name: "register" })
  signUp(@Args("registerInput") registerInput: RegisterInput) {
    return this.authService.sighUp(registerInput);
  }
}
