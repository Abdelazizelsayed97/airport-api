import { InputType, Int, Field, ObjectType } from '@nestjs/graphql';
import { IsPassportNumber } from 'class-validator';
import { CreateBookInput } from 'src/book/dto/create-book.input';
import { UsersRoles } from 'src/enums/user.roles';

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
