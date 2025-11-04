import { registerEnumType } from '@nestjs/graphql';

import { Role } from 'role/entities/role.entity';

export enum UsersRoles {
  super_admin = 'super_admin',
  admin = 'admin',
  staff = 'staff',
  user = 'user',
}

registerEnumType(UsersRoles, {
  name: 'UsersRoles',
});

export function addNewRole(role: Role) {
  UsersRoles[role.name] = role.name;
  registerEnumType(UsersRoles, {
    name: 'UsersRoles',
  });
}
