import { Field, InputType } from "@nestjs/graphql";


@InputType()
export class FlightsFilterInput {
    @Field(() => String)
    name: string;
    @Field(() => String)
    passport_number: String;
    @Field(() => String)
    airLine: string;
}