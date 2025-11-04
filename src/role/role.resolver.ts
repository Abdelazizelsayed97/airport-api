import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Role } from './entities/role.entity';
import { RoleService } from './role.service';
import { CreateRoleInput } from './dto/create-role.input';

@Resolver()
export class RoleResolver {
  constructor(readonly roleService: RoleService) {}
  @Mutation(() => Role)
  async createRole(
    @Args('createRoleInput', { type: () => CreateRoleInput })
    createRoleInput: CreateRoleInput,
  ) {
    return this.roleService.create(createRoleInput);
  }
  @Query(() => [Role])
  async fetchRoles() {
    return this.roleService.findAll();
  }
  @Query(() => Role)
  getRole(id: string) {
    return this.roleService.findOne(id);
  }
  @Query(() => String)
  removeRole(id: string) {
    return this.roleService.remove(id);
  }
}
