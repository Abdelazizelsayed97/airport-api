import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { UsersRoles } from '@core/enums/user.roles';

@InputType()
export class CreateBookInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  flightNumber: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  seatNumber: string;

  @Field(() => UsersRoles)
  @IsNotEmpty()
  role: UsersRoles;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  userId: string;
}
