import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { UsersRoles } from '@core/enums/user.roles';

@InputType()
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

  @Field(() => String)
  fcmToken: string;
}
