import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { sout } from 'users/users.service';
import { PermissionsD } from 'permissions/decorators/permissions.decorator';
import { UsersRoles } from '@core/enums/user.roles';
import { AuthGuard } from 'auth/guard/auth.guard';
import { PermissionsGuard } from 'permissions/guard/permissions.guard';
import { action } from '@core/enums/permissions.action';
import { Roles } from 'auth/decorators/auth.decorator';
import { RolesGuard } from 'users/users.guards/role.guard';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}
  @PermissionsD(action.create)
  @Roles(UsersRoles.super_admin)
  @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
  async create(createRoleInput: CreateRoleInput) {
    let role = await this.roleRepository.findOneBy({
      name: createRoleInput.name,
    });
    if (role) {
      throw new Error('Role already exist');
    }
    sout(createRoleInput);
    role = this.roleRepository.create({
      name: createRoleInput.name,
      permissions: createRoleInput.permissions,
    });
    return await this.roleRepository.save(role);
  }

  findAll() {
    return this.roleRepository.find();
  }
  async findByName(name: string) {
    sout(name);
    if (name === null) {
      throw new Error("Name can't be null");
    }
    const role = await this.roleRepository.findOneBy({ name: name });
    if (!role) {
      throw new NotFoundException();
    }
    return role;
  }

  async findOne(id: string) {
    const role = await this.roleRepository.findOneBy({ name: id });

    if (!role) {
      throw new Error("Role doesn't exist");
    }
    return role;
  }

  async updateRolePermissions(updateRoleInput: UpdateRoleInput) {
    const role = await this.findOne(updateRoleInput.id);
    if (!role) {
      throw new Error("Role doesn't exist");
    }

    if (!role) {
      throw new Error("Permissions doesn't exist");
    }

    Object.assign(role, updateRoleInput);
    return await this.roleRepository.save(role);
  }

  async remove(id: string) {
    if (!id || id === null) {
      throw new Error("Id can't be null");
    }
    return await this.roleRepository.delete(id);
  }
}
