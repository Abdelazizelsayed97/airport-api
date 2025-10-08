import { InputType, Int, Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export  class CreateBookInput {
  @Field(() => String)
  @IsString()
  flightNumber: string

  @Field(() => Int)
  @IsString()
  seatNumber: Number
}
