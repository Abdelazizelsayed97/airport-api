import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersServices } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from '../auth/dto/update-user.input';
import PaginationInput from 'src/pagination/pagination.dto';
import { RolesGuard } from './users.guards/role.guard';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { UsersRoles } from 'src/enums/user.roles';
import { Roles } from 'src/auth/decorators/auth.decorator';

// @Roles(UsersRoles.admin, UsersRoles.staff)
// @UseGuards(AuthGuard, RolesGuard)
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
  @Roles(UsersRoles.passenger, UsersRoles.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => User, { name: 'deleteUser' })
  removeUser(@Args('id', { type: () => String }) id: string) {
    return this.usersService.remove(id);
  }
}
