import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, Int, ObjectType, GraphQLTimestamp } from '@nestjs/graphql';

import { FlightStaff } from 'src/fight_staff/entities/fight_staff.entity';
import { flight_status } from 'src/enums/flight.status';

@ObjectType()
@Entity()
export default class FlightMangementEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Field(() => String)
  @Column({ unique: true })
  flight_number: string;

  @Field(() => String)
  @Column()
  departure_airport: string;

  @Field(() => String)
  @Column()
  destination_airport: string;

  @Field(() => GraphQLTimestamp)
  @Column()
  departure_time: Date;

  @Field(() => GraphQLTimestamp)
  @Column()
  arrival_time: Date;

  @Field()
  @Column()
  airline: string;

  @Field(() => Int)
  @Column()
  available_seats: number;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  takenSeats?: number;

  @Field(() => flight_status)
  @Column({ enum: flight_status, type: 'enum' })
  flight_status: flight_status;

  @Field(() => FlightStaff)
  @OneToOne(() => FlightStaff, (flightStaff) => flightStaff.flight)
  assigned: FlightStaff;

  constructor() {}
}
