import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'users/entities/user.entity';

@ObjectType()
@Entity()
export class Notifcation {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => String)
  @Column()
  title: string;
  @Field(() => String)
  @Column()
  body: string;
  @Field(() => String)
  @Column()
  type: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.receivedNotifications)
  reciver: User;
  @Field(() => Date)
  @Column()
  createdAt: Date;
  @Field()
  @Column({ default: false })
  isRead: boolean;
}
