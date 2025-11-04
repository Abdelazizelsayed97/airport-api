import { SetMetadata } from '@nestjs/common';
import { UsersRoles } from '@core/enums/user.roles';

export const role_key = 'roles';

export const Roles = (
  ...roles: [UsersRoles, ...UsersRoles[]] | [string, ...string[]]
) => SetMetadata(role_key, roles);
