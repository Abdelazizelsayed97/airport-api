import { InputType, Field, GraphQLTimestamp } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { flight_status } from '@core/enums/flight.status';
import { CreateFightStaffInput } from 'fight_staff/dto/create-fight_staff.input';
import { Timestamp } from 'typeorm';

@InputType()
export class CreateFlightMangementInput {
  @IsString()
  @Field()
  @IsNotEmpty()
  flight_number: string;
  @IsString()
  @IsNotEmpty()
  @Field()
  departure_airport: string;
  @Field()
  @IsString()
  @IsNotEmpty()
  destination_airport: string;
  @Field(() => GraphQLTimestamp)
  @IsNotEmpty()
  departure_time: Timestamp;
  @Field(() => GraphQLTimestamp)
  @IsDate()
  @IsNotEmpty()
  arrival_time: Timestamp;
  @Field()
  @IsString()
  @IsNotEmpty()
  airline: string;
  @Field()
  @IsNotEmpty()
  available_seats: number;
  @Field(() => flight_status, { nullable: true })
  @IsNotEmpty()
  @IsString()
  flight_status: flight_status;
  @Field(() => CreateFightStaffInput, { nullable: true })
  assignedStaff?: CreateFightStaffInput;
}
