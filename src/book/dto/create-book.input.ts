import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { UsersRoles } from 'enums/user.roles';

@InputType()
export class CreateBookInput {
  @Field(() => String)
  @IsString()
  flightNumber: string;

  @Field(() => String)
  @IsString()
  seatNumber: string;

  @Field(() => UsersRoles)
  @IsString()
  role: UsersRoles; 

  @Field(() => String)
  @IsString()
  userId: string;
}
