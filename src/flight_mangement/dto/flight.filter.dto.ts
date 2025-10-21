import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FlightsFilterInput {
  @Field(() => String)
  name: string;
  @Field(() => String)
  passport_number: string;
  @Field(() => String)
  airLine: string;
}
