import { InputType, Int, Field } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateFcmInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  token: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  deviceInfo?: string;

  @Field()
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
