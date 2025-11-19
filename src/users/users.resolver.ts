import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveField,
  Parent,
} from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import DataLoader from "dataloader";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { UserService } from "./users.service";
import { User } from "./entities/user.entity";
import { UpdateUserInput } from "../auth/dto/update-user.input";
import PaginationInput from "pagination/pagination.dto";
import { CurrentUser } from "auth/decorators/current-user.decorator";
import { PermissionsGuard } from "permissions/guard/permissions.guard";
import { PermissionsD } from "permissions/decorators/permissions.decorator";
import { action } from "@core/enums/permissions.action";
import { Booking } from "booking/entities/book.entity";
import { userBookingsLoader } from "@core/loaders/user-bookings.loader";

// @Roles(UsersRoles.super_admin, UsersRoles.admin, UsersRoles.staff)
// @PermissionsD(action.create, action.create_user)
// @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
// @UseInterceptors(GraphqlResponseInspector)
@Resolver(() => User)
export class UserResolver {
  private userBookingsLoaderInstance: DataLoader<string, Booking[]>;

  constructor(
    private readonly usersService: UserService,

    @InjectDataSource() private dataSource: DataSource
  ) {
    this.userBookingsLoaderInstance = userBookingsLoader(this.dataSource);
  }

  @PermissionsD(action.super_admin)
  @UseGuards(PermissionsGuard)
  @Query(() => [User], { name: "users", nullable: true })
  async getAllUsers(
    @Args("paginate", { type: () => PaginationInput, nullable: true })
    pagination: PaginationInput
  ): Promise<User[]> {
    return this.usersService.getAllUsers(pagination);
  }
  @PermissionsD(action.super_admin)
  @UseGuards(PermissionsGuard)
  @Query(() => User, { name: "getUserById" })
  async getUserById(
    @Args("id", { type: () => String }) id: string
  ): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User, { name: "updateUser" })
  updateUser(@Args("updateUserInput") updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  // @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => User, { name: "deleteUser" })
  removeUser(@Args("id", { type: () => String }) id: string) {
    return this.usersService.remove(id);
  }

  @Query(() => User)
  async me(@CurrentUser() user: User) {
    return user;
  }

  @ResolveField(() => [Booking], { nullable: true })
  async bookingList(@Parent() user: User): Promise<Booking[]> {
    return await this.userBookingsLoaderInstance.load(user.id);
  }
}
