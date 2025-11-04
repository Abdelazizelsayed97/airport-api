import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Employee } from 'employee/entities/employee.entity';

import { staff_Roles } from '@core/enums/crew.roles';
import FlightEntity from 'flight_mangement/entities/flight.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class FlightStaff {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @ManyToMany(() => Employee, (emp) => emp.assigned_flights.id)
  employeeID: string;

  @Field(() => FlightEntity, { nullable: true })
  @OneToOne(() => FlightEntity, (flight) => flight.assigned, {
    nullable: true,
  })
  flight?: FlightEntity;
}
