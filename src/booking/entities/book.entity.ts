import { ObjectType, Field } from "@nestjs/graphql";
import FlightEntity from "flight_mangement/entities/flight.entity";

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "users/entities/user.entity";

@Entity({ synchronize: true })
@ObjectType()
export class Booking {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => FlightEntity, { nullable: true })
  @ManyToOne(() => FlightEntity, (flight) => flight.bookings)
  flight: FlightEntity;

  @Field(() => String)
  @Column()
  seatNumber: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.bookingList)
  user: User;
  @Field(() => Date)
  @Column({ nullable: true })
  createdAt?: Date;
  @Field(() => Date)
  @Column({ nullable: true })
  updatedAt: Date;
}
