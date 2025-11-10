import { InputType, Field } from "@nestjs/graphql";
import { staff_Roles } from "@core/enums/crew.roles";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class CreateEmployeeInput {
  @Field(() => staff_Roles)
  @IsNotEmpty()
  @IsEnum(staff_Roles)
  role: staff_Roles;
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  user_id: string;
}
