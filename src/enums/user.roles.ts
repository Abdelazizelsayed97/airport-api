import { registerEnumType } from "@nestjs/graphql";

export enum UserBasedRole {
  passenger = 'passenger',
    staff = 'staff',
  admin = 'admin',
}

registerEnumType(UserBasedRole, {
  name: 'UserBasedRole',
});
