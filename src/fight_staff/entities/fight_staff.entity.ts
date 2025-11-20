import { ObjectType, Field } from "@nestjs/graphql";
import { Employee } from "employee/entities/employee.entity";

import FlightEntity from "flight_mangement/entities/flight.entity";
import {
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@ObjectType()
@Entity({ synchronize: true })
// @Index(['name', 'employeeID'])
export class FlightStaff {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => [Employee])
  @OneToMany(() => Employee, (emp) => emp.assigned_flights)
  employees: Employee[];

  @Field(() => FlightEntity, { nullable: true })
  @ManyToOne(() => FlightEntity, (flight) => flight.id, {
    nullable: true,
  })
  flight?: FlightEntity;
}
