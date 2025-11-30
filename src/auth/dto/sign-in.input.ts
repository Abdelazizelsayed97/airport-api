import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
@InputType()
  
export class SignInDto {
  @Field(() => String)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @Field(() => String)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  fcmToken: string;
}
  