import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Employee } from 'employees/entities/employee.entity';
import { staff_Roles } from 'enums/crew.roles';
import FlightEntity from 'flight_mangement/entities/flight.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class FlightStaff {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Field(() => String)
  @Column()
  name: string;
  @Field(() => String)
  @Column({ type: 'enum', enum: staff_Roles })
  role: staff_Roles;
  @Field(() => String)
  @ManyToMany(() => Employee, (emp) => emp.assigned_flights.id)
  employeeID: string;
  @Field(() => FlightEntity, { nullable: true })
  @OneToOne(() => FlightEntity, (flight) => flight.assigned)
  flight?: FlightEntity;
}
