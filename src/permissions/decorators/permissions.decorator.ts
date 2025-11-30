import { SetMetadata } from '@nestjs/common';
import { action } from '@core/enums/permissions.action';

export const permission_key = 'permissions';

export const PermissionsD = (
  ...permissions: [action, ...action[]] | [string, ...string[]]
) => SetMetadata(permission_key, permissions);