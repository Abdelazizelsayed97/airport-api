import { Injectable, UseGuards } from '@nestjs/common';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { AuthGuard } from 'auth/guard/auth.guard';
import { RolesGuard } from 'users/users.guards/role.guard';
import { Roles } from 'auth/decorators/auth.decorator';
import { PermissionsD } from 'permissions/decorators/permissions.decorator';
import { PermissionsService } from 'permissions/permissions.service';

// @UseGuards(AuthGuard, RolesGuard)
// @Roles('super_admin')
// @PermissionsD()
@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    readonly permission: PermissionsService,
  ) {}
  async create(createRoleInput: CreateRoleInput) {
    const role = await this.roleRepository.create({ ...createRoleInput });
    if (role) {
      throw new Error('Role already exist');
    }

    return await this.roleRepository.save(role);
  }

  findAll() {
    return this.roleRepository.find();
  }

  async findOne(id: string) {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) {
      throw new Error("Role doesn't exist");
    }
    return role;
  }

  async updatePermissions(updateRoleInput: UpdateRoleInput) {
    const role = await this.findOne(updateRoleInput.id);
    if (!role) {
      throw new Error("Role doesn't exist");
    }
    const permissions = await this.permission.findOnePermission(
      updateRoleInput.name!,
    );
    if (!permissions) {
      throw new Error("Permissions doesn't exist");
    }
    role.permissions = [...role.permissions, permissions];
    Object.assign(role, updateRoleInput);
    return role;
  }

  async remove(id: string) {
    if (!id || id === null) {
      throw new Error("Id can't be null");
    }
    return await this.roleRepository.delete(id);
  }
}
