import { CreateAirLineInput } from './create-air_line.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAirLineInput extends PartialType(CreateAirLineInput) {
  @Field(() => Int)
  id: number;
}
