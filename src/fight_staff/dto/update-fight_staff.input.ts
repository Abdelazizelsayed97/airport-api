import { CreateFightStaffInput } from './create-fight_staff.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateFightStaffInput extends PartialType(CreateFightStaffInput) {
  @Field(() => Int)
  id: number;
}
