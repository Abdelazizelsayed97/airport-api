import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { UsersRoles } from 'enums/user.roles';
import { Role } from 'role/entities/role.entity';

@InputType()
@ObjectType()
export class RegisterInput {
  @Field(() => String)
  passportNumber: string;
  @Field(() => String)
  email: string;
  @Field(() => String)
  password: string;
  @Field(() => String)
  name: string;
  @Field(() => UsersRoles)
  role: UsersRoles;
}
