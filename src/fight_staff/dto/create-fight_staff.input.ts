import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class CreateFightStaffInput {
  @Field(() => [String])
  @IsNotEmpty()
  employeeIds: string[];

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  fight_id: string;
}
