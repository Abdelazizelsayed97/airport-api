import { ObjectType, Field, Int } from '@nestjs/graphql';
import { staff_Roles } from 'src/enums/crew.roles';
import { FlightStaff } from 'src/fight_staff/entities/fight_staff.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('employees')
export class Employee {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  @PrimaryGeneratedColumn()
  id: number;
  @Field(() => String)
  @Column()
  name: string;
  @Field(() => String)
  @Column()
  email: string;
  @Field(() => staff_Roles)
  @Column({ type: 'enum', enum: staff_Roles, default: staff_Roles.crew })
  role: staff_Roles;
  @Field(() => [FlightStaff])
  @ManyToMany(() => FlightStaff, (fightStaff) => fightStaff.flight)
  assigned_flights: FlightStaff;
}