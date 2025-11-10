import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateAirLineInput {

  @IsString()
  @Field(() => String)
  name: string;
  @Field(() => String)
  @IsString()
  country: string;
}
