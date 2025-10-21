import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, Int, ObjectType, GraphQLTimestamp } from '@nestjs/graphql';
import { flight_status } from '../../enums/flight.status';
import { User } from '../../users/entities/user.entity';
import { FlightStaff } from 'fight_staff/entities/fight_staff.entity';

@ObjectType()
@Entity()
export default class FlightEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @OneToMany(() => User, (user) => user.bookingList)
  @Field(() => [User], { nullable: true })
  passagngers: User[];
  constructor() {}
}
