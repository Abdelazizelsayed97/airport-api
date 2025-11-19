import { ObjectType, Field } from "@nestjs/graphql";
import { staff_Roles } from "@core/enums/crew.roles";
import { FlightStaff } from "fight_staff/entities/fight_staff.entity";
import {
  Column,
  Entity,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from "typeorm";
import { User } from "users/entities/user.entity";

@ObjectType()
@Entity("employees", { synchronize: true })
export class Employee {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Field(() => User)
  @OneToOne(() => User, (user) => user.employee)
  @JoinColumn()
  user: User;
  @Field(() => staff_Roles)
  @Column({ type: "enum", enum: staff_Roles, default: staff_Roles.crew })
  role: staff_Roles;
  @Field(() => [FlightStaff], {
    nullable: true,
  })
  @OneToOne(() => FlightStaff, (fightStaff) => fightStaff.employees, {
    nullable: true,
  })
  assigned_flights?: FlightStaff;
}
