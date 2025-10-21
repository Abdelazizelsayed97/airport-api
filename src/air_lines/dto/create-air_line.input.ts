import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateAirLineInput {
  @Field(() => String)
  name: string;
  @Field(() => String)
  country: string;
}
