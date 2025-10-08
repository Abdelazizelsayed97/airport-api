import { InputType, Int, Field } from '@nestjs/graphql';
import { staff_Roles } from 'src/enums/crew.roles';
import { FlightStaff } from 'src/fight_staff/entities/fight_staff.entity';

@InputType()
export class CreateEmployeeInput {
 @Field(() => String)

  name: string;
  @Field(() => String)

  email: string;
  @Field(() => staff_Roles)

  role: staff_Roles;
  @Field(() => [FlightStaff])

  assigned_flights: FlightStaff;
}
