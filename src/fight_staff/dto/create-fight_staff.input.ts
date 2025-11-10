import { InputType, Field } from '@nestjs/graphql';
import { IsAlpha, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { staff_Roles } from '@core/enums/crew.roles';

@InputType()
export class CreateFightStaffInput {
  @Field(() => String)
  @IsString()
  @IsAlpha()
  @IsNotEmpty()
  name: string;
  @Field(() => staff_Roles)
  @IsNotEmpty()
    @IsEnum(staff_Roles)
  role: staff_Roles;
  @Field(() => [String])
  employeeIds: string[];
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  fight_id: string;
}
