import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class CreateBookInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  flightId: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  seatNumber: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  userId: string;
}
