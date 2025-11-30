import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { UsersRoles } from '@core/enums/user.roles';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Unique } from 'typeorm';

@InputType()
export class RegisterInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  passportNumber: string;
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @Field(() => UsersRoles)
  role: UsersRoles;
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  fcmToken: string;
}
