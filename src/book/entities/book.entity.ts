import { ObjectType, Field } from '@nestjs/graphql';

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'users/entities/user.entity';

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
