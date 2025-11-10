import { ObjectType, Field } from '@nestjs/graphql';
import { Employee } from 'employee/entities/employee.entity';

import FlightEntity from 'flight_mangement/entities/flight.entity';
import {
  Column,
  Entity,
  Index,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
// @Index(['name', 'employeeID'])
export class FlightStaff {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => [Employee])
  @ManyToMany(() => Employee, (emp) => emp.assigned_flights)
  employees: Employee[];

  @Field(() => FlightEntity, { nullable: true })
  @OneToOne(() => FlightEntity, (flight) => flight.id, {
    nullable: true,
  })
  flight?: FlightEntity;
}
