import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Role } from './entities/role.entity';
import { RoleService } from './role.service';
import { CreateRoleInput } from './dto/create-role.input';
import { action } from '@core/enums/permissions.action';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'auth/guard/auth.guard';
import { PermissionsD } from 'permissions/decorators/permissions.decorator';
import { PermissionsGuard } from 'permissions/guard/permissions.guard';

@Resolver()
export class RoleResolver {
  constructor(readonly roleService: RoleService) {}
  @Mutation(() => Role)
  @PermissionsD(action.super_admin)
  @UseGuards(AuthGuard, PermissionsGuard)
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
