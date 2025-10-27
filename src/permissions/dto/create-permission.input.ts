import { InputType, Int, Field } from '@nestjs/graphql';
import { UsersRoles } from 'enums/user.roles';

@InputType()
export class CreatePermissionInput {
  @Field()
  permissionName: string;
  @Field()
  description: string;
}
