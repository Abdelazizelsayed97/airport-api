
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateFightStaffInput {
  @Field(() => String)
  name: string;
  @Field(() => String)
  role: string;
  @Field(() => String)
  employeeID: string;
  @Field(() => String)
  fight_id: String;
}
