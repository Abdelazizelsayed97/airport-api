import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { UsersRoles } from 'enums/user.roles';


@InputType()
@ObjectType()
export class SignUpDto {
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
