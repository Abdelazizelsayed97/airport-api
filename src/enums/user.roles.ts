import { registerEnumType } from "@nestjs/graphql";

export enum UsersRoles {
  passenger = 'passenger',
    staff = 'staff',
  admin = 'admin',
}

registerEnumType(UsersRoles, {
  name: 'UserBasedRole',
});
