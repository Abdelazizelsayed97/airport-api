import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateRoleInput } from "./dto/create-role.input";
import { UpdateRoleInput } from "./dto/update-role.input";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "./entities/role.entity";
import { DataLoaderService } from "@app/dataloader/dataloader.service";
import DataLoader from "dataloader";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private readonly dataLoaderService: DataLoaderService
  ) {}

  async create(createRoleInput: CreateRoleInput) {
    let role = await this.roleRepository.findOneBy({
      name: createRoleInput.name,
    });
    if (role) {
      throw new Error("Role already exist");
    }
    console.log(createRoleInput);
    role = this.roleRepository.create({
      name: createRoleInput.name,
      permissions: createRoleInput.permissions,
    });
    return await this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  createRolesLoader(): DataLoader<string, Role> {
    return this.dataLoaderService.createLoader<string, Role>(
      async (ids: readonly string[]) => {
        const roles = await this.roleRepository.find({
          where: ids.length > 0 ? ids.map((id) => ({ id })) : undefined,
        });
        const roleMap = new Map(roles.map((role) => [role.id, role]));
        return ids.map(
          (id) => roleMap.get(id) || new Error(`Role not found: ${id}`)
        );
      }
    );
  }
  async findByName(name: string) {
    console.log(name);
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
