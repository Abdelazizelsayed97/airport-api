import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export default class PaginationInput {
  constructor(page: number = 1, limit: number = 15) {}
  @Field(() => Int, { defaultValue: 1, nullable: true })
  page?: number;
  @Field(() => Int, { defaultValue: 20, nullable: true })
  limit: number;
}
