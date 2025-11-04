import { ObjectType, Field } from '@nestjs/graphql';
import { staff_Roles } from '@core/enums/crew.roles';
import { FlightStaff } from 'fight_staff/entities/fight_staff.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'users/entities/user.entity';

@ObjectType()
@Entity('employees', { synchronize: true })
export class Employee {
  @Field(() => String, { description: 'Example field (placeholder)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => User)
  @OneToOne(() => User, (user) => user.id)
  users: User;
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
