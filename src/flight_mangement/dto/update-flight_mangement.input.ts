import { CreateFlightMangementInput } from './create-flight_mangement.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateFlightMangementInput extends PartialType(CreateFlightMangementInput) {
  @Field(() => Int)
  id: number;
}
