import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthServices } from './users.service';
import { User } from './entities/user.entity';

import { UpdateUserInput } from '../auth/dto/update-user.input';

import PaginationInput from 'src/pagination/pagination.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: AuthServices) {}

  // @Mutation(() => User, { name: 'signUp' })
  // async signUp(
  //   @Args('registerInput') createUserInput: SignUpDto,
  // ): Promise<User> {
  //   return this.usersService.sighUp(createUserInput);
  // }
  // @Mutation(() => User, { name: 'signIn' })
  // signIn(@Args('signInDto') input: SignInDto) {
  //   return this.usersService.signIn(input);
  // }
  @Query(() => [User], { name: 'users' })
  async getAllUsers(
    @Args('paginate', { type: () => PaginationInput })
    pagination: PaginationInput,
  ): Promise<User[]> {
    return this.usersService.getAllUsers(pagination);
  }
  // @Query(() => [User], { name: "getUsersByRole" })

  @Query(() => User, { name: 'getUserById' })
  async getUserById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User, { name: 'deleteUser' })
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }
}
