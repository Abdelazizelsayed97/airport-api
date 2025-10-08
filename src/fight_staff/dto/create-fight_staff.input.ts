import { InputType, Field } from '@nestjs/graphql';
import { CreateEmployeeInput } from 'src/employees/dto/create-employee.input';


@InputType()
export class CreateFightStaffInput {
  @Field(() => CreateEmployeeInput)
  pilot: CreateEmployeeInput;

  @Field(() => CreateEmployeeInput)
  crew: CreateEmployeeInput;

  @Field(() => CreateEmployeeInput)
  ground_staff: CreateEmployeeInput;

  @Field(() => CreateEmployeeInput)
  security: CreateEmployeeInput;
}
  