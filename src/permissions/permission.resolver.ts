import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { PermissionsService } from './permissions.service';
import { CreatePermissionInput } from './dto/create-permission.input';
import { UpdatePermissionInput } from './dto/update-permission.input';

@Resolver()
export class PermissionResolver {
  constructor(readonly permissionsService: PermissionsService) {}
  @Mutation()
  async createPermission(
    @Args('createPermissionInput', { type: () => CreatePermissionInput })
    createPermissionInput: CreatePermissionInput,
  ) {
    return await this.permissionsService.create(createPermissionInput);
  }
  @Mutation()
  async removePermission(@Args('id', { type: () => String }) id: string) {
    return await this.permissionsService.remove(id);
  }
  @Mutation()
  async updatePermission(
    @Args('updatePermissionInput', { type: () => UpdatePermissionInput })
    updatePermissionInput: UpdatePermissionInput,
  ) {
    return await this.permissionsService.update(updatePermissionInput);
  }
  @Query()
  async getAllPermissions() {
    return await this.permissionsService.findAll();
  }
}
