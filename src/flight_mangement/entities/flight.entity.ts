import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, Int, ObjectType, GraphQLTimestamp } from "@nestjs/graphql";
import { flight_status } from "../../core/enums/flight.status";
import { FlightStaff } from "fight_staff/entities/fight_staff.entity";
import { Booking } from "../../booking/entities/book.entity";

@ObjectType()
@Entity()
export default class FlightEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  @Index("flight_number_index", { unique: true })
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

  @Field(() => flight_status, { nullable: true })
  @Column({ enum: flight_status, type: "enum" })
  flight_status?: flight_status;

  @Field(() => FlightStaff, { nullable: true })
  @OneToMany(() => FlightStaff, (flightStaff) => flightStaff.flight, {
    nullable: true,
  })
    
  @JoinColumn()
  assigned: FlightStaff;

  @Field(() => [Booking], { nullable: true })
  @OneToMany(() => Booking, (book) => book.flight?.id, { nullable: true })
  bookings?: Booking[];
  @Field(() => Date)
  @Column({ nullable: true })
  createdAt: Date;
  @Field(() => Date)
  @Column({ nullable: true })
  updatedAt: Date;
}
