import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ synchronize: true })
@ObjectType()
export class Book {
  @Field(() => String)
  @PrimaryGeneratedColumn()
  id: string;
  @Field(() => String)
  @Column()
  flightNumber: string;
  @Field(() => String)
  @Column()
  seatNumber: string;
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.bookingList)
  user: User;
}
