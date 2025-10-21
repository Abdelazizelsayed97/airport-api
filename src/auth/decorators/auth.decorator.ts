import { SetMetadata } from '@nestjs/common';
import { UsersRoles } from 'enums/user.roles';

export const role_key = 'roles';

export const Roles = (...roles: [UsersRoles, ...UsersRoles[]]) =>
  SetMetadata(role_key, roles);
