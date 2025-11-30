import { registerEnumType } from '@nestjs/graphql';

export enum staff_Roles {
  pilot = 'pilot',
  crew = 'crew',
  security = 'security',
}

registerEnumType(staff_Roles, { name: 'staff_Roles' });
