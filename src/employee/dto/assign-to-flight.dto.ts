import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AssignToFlightDto {
  @Field()
  employeeId: string;
  @Field()
  flightId: string;
}
