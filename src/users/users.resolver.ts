import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { sout, UsersServices } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from '../auth/dto/update-user.input';
import { RolesGuard } from './users.guards/role.guard';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { GraphqlResponseInspector } from './inspectors/users.response.inspector';
import { Roles } from 'auth/decorators/auth.decorator';
import { AuthGuard } from 'auth/guard/auth.guard';
import PaginationInput from 'pagination/pagination.dto';
import { CurrentUser } from 'auth/decorators/current-user.decorator';
import { UsersRoles } from 'enums/user.roles';

// @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
// @Roles('super_admin', 'admin', 'staff')
// @PermissionsD('super_admin', 'admin', 'staff')

@Resolver(() => User)
@UseInterceptors(GraphqlResponseInspector)
export class UsersResolver {
  constructor(private readonly usersService: UsersServices) {}

  @Query(() => [User], { name: 'users' })
  async getAllUsers(
    @Args('paginate', { type: () => PaginationInput })
    pagination: PaginationInput,
  ): Promise<User[]> {
    return this.usersService.getAllUsers(pagination);
  }
  // @UseGuards(AuthGuard, RolesGuard)
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
  @Roles(UsersRoles.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Query(() => User)
  async me(@CurrentUser() ctx) {
    // const user = ctx.user.id;
    sout('+++++++++++++++++++++   ' + ctx['id']);
    return this.usersService.findOne(ctx['id']);
  }
}
