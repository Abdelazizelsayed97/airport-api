import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UsersServices } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from '../auth/dto/update-user.input';
import { RolesGuard } from './users.guards/role.guard';
import { UseGuards, UseInterceptors } from '@nestjs/common';
// import { GraphqlResponseInspector } from './inspectors/users.response.inspector';
import { AuthGuard } from 'auth/guard/auth.guard';
import PaginationInput from 'pagination/pagination.dto';
import { CurrentUser } from 'auth/decorators/current-user.decorator';
import { PermissionsGuard } from 'permissions/guard/permissions.guard';
import { PermissionsD } from 'permissions/decorators/permissions.decorator';
import { action } from '@core/enums/permissions.action';

// @Roles(UsersRoles.super_admin, UsersRoles.admin, UsersRoles.staff)
@PermissionsD(action.create, action.create_user)
@UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
// @UseInterceptors(GraphqlResponseInspector)
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersServices) {}

  @Query(() => [User], { name: 'users' })
  async getAllUsers(
    @Args('paginate', { type: () => PaginationInput })
    pagination: PaginationInput,
  ): Promise<User[]> {
    return this.usersService.getAllUsers(pagination);
  }
  @PermissionsD(action.super_admin)
  @UseGuards(PermissionsGuard)
  @Query(() => User, { name: 'getUserById' })
  async getUserById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  // @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => User, { name: 'deleteUser' })
  removeUser(@Args('id', { type: () => String }) id: string) {
    return this.usersService.remove(id);
  }

  @Query(() => User)
  async me(@CurrentUser() user: User) {
    return user;
  }
}
