import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreatePermissionInput } from './dto/create-permission.input';
import { UpdatePermissionInput } from './dto/update-permission.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import { RolesGuard } from 'users/users.guards/role.guard';
import { Roles } from 'auth/decorators/auth.decorator';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createPermissionInput: CreatePermissionInput) {
    const isExisted = await this.permissionRepository.findOneBy({
      permission: createPermissionInput.permissionName,
    });
    if (isExisted) {
      return 'Permission already exist';
    }
    const permission = this.permissionRepository.create(createPermissionInput);
    return this.permissionRepository.save(permission);
  }

  findAll() {
    return this.permissionRepository.find();
  }

  async findOnePermission(id: string) {
    const permission = await this.permissionRepository.findOneBy({ id });
    if (!permission) {
      throw new NotFoundException("Permission doesn't exist");
    }
    return permission;
  }

  async update(updatePermissionInput: UpdatePermissionInput) {
    const permission = await this.findOnePermission(updatePermissionInput.id);
    Object.assign(permission, updatePermissionInput);
    await this.permissionRepository.save(permission);
    return permission;
  }

  remove(id: string) {
    if (!id) {
      throw new NotFoundException("Id can't be null");
    }
    return this.permissionRepository.delete(id);
  }
}
