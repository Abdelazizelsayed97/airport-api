import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export default class PaginationInput {
  @Field(() => Int, { defaultValue: 1 })
  page: number;
  @Field(() => Int, { defaultValue: 20 })
  limit: number;
}
