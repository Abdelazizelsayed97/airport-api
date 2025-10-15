import { InputType, Field } from '@nestjs/graphql';
import { IsAlpha, IsNotEmpty, IsString } from 'class-validator';
import { staff_Roles } from 'src/enums/crew.roles';

@InputType()
export class CreateFightStaffInput {
  @Field(() => String)
  @IsString()
  @IsAlpha()
  @IsNotEmpty()
  name: string;
  @Field(() => staff_Roles)
  @IsNotEmpty()
  role: staff_Roles;
  @Field(() => String)
  @IsNotEmpty()
  employeeID: string;
  @Field(() => String)
  @IsNotEmpty()
  fight_id: string;
}
