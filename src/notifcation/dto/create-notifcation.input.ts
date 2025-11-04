import { InputType, Int, Field } from '@nestjs/graphql';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

@InputType()
export class CreateNotifcationInput {
  @Field(() => String)
  title: string;
  @Field(() => String)
  body: string;
  @Field(() => String)
  type: string;
  @Field(() => String)
  image: string;
  @Field(() => String)
  user_id: string;
}
