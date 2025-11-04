import { CreateNotifcationInput } from './create-notifcation.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateNotifcationInput extends PartialType(CreateNotifcationInput) {
  @Field(() => String)
  id: string;
}
