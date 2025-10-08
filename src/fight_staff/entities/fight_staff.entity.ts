import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Employee } from 'src/employees/entities/employee.entity';
import FlightMangementEntity from 'src/flight_mangement/entities/flight_mangement.entity';
import {
  Column,
  Entity,
  JoinTable,
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
  @Field(() => Employee)
  @OneToMany(() => Employee, (employee) => employee.assigned_flights)
  pilot: Employee;

  @Field(() => Employee)
  @OneToMany(() => Employee, (employee) => employee.assigned_flights)
  crew: Employee;

  @Field(() => Employee)
  @OneToMany(() => Employee, (employee) => employee.assigned_flights)
  ground_staff: Employee;

  @Field(() => Employee)
  @OneToMany(() => Employee, (employee) => employee.assigned_flights)
  security: Employee;
  @Field(() => FlightMangementEntity, { nullable: true })
  @OneToOne(() => FlightMangementEntity, (flight) => flight.assigned)
  flight?: FlightMangementEntity;
}
