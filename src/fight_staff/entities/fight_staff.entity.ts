import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Employee } from 'src/employees/entities/employee.entity';
import { staff_Roles } from 'src/enums/crew.roles';
import FlightEntity from 'src/flight_mangement/entities/flight.entity';

import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class FlightStaff {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  @OneToMany(() => Employee, (employee) => employee.assigned_flights)
  id: number;
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
