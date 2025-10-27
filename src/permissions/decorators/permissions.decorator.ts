import { SetMetadata } from '@nestjs/common';
import { action } from 'enums/permissions.action';
import { Permission } from 'permissions/entities/permission.entity';

const permission_key = 'permissions';

export const PermissionsD = (
  ...permissions:
    | action[]
    | [string, ...(string[] | [Permission, ...Permission[]])]
) => SetMetadata(permission_key, permissions);
