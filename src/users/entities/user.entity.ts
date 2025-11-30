import { ObjectType, Field, GraphQLTimestamp } from "@nestjs/graphql";
import { Exclude } from "class-transformer";
import { Booking } from "../../booking/entities/book.entity";
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  Timestamp,
} from "typeorm";
import { Role } from "../../role/entities/role.entity";
import { Employee } from "../../employee/entities/employee.entity";

@ObjectType()
@Entity({ synchronize: true })
export class User {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column({ unique: true })
  email: string;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => Role)
  @ManyToOne(() => Role, { eager: true })
  role: Role;

  @Exclude()
  @Column()
  password: string;

  @Field(() => [Booking], { nullable: true })
  @OneToMany(() => Booking, (booking) => booking.user, { nullable: true})
  bookingList?: Booking[];

  @Field(() => Employee, { nullable: true, defaultValue: null })
  @OneToOne(() => Employee, (employee) => employee.user, { nullable: true })
  employee?: Employee;

  @Field(() => String)
  @Column()
  token: string;

  @Column({ default: "" })
  verificationCode: string;

  @Field(() => Boolean)
  @Column("boolean", { default: false })
  isVerified: boolean;

  @Field(() => GraphQLTimestamp)
  @Column("timestamp", { nullable: true })
  createdAt: Timestamp;

  @Field(() => GraphQLTimestamp)
  @Column("timestamp", { nullable: true })
  updatedAt: Timestamp;
}
