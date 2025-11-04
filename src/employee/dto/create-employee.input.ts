import { InputType, Field } from '@nestjs/graphql';
import { staff_Roles } from '@core/enums/crew.roles';
import { CreateFightStaffInput } from 'fight_staff/dto/create-fight_staff.input';

@InputType()
export class CreateEmployeeInput {
  @Field(() => String)
  name: string;
  @Field(() => String)
  email: string;
  @Field(() => staff_Roles)
  role: staff_Roles;
}
