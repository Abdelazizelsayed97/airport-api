import { InputType, Int, Field } from '@nestjs/graphql';
import { staff_Roles } from 'src/enums/crew.roles';
import { CreateFightStaffInput } from 'src/fight_staff/dto/create-fight_staff.input';


@InputType()
export class CreateEmployeeInput {
  @Field(() => String)
  name: string;
  @Field(() => String)
  email: string;
  @Field(() => staff_Roles)
  role: staff_Roles;
  @Field(() => CreateFightStaffInput, { nullable: true })
  assigned_flights: CreateFightStaffInput;
}
