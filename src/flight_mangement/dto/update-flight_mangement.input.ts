import { CreateFlightMangementInput } from './create-flight_mangement.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateFlightMangementInput extends PartialType(
  CreateFlightMangementInput,
) {
  @Field(() => String)
  id: string;
}
