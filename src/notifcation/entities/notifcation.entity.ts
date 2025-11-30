import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'users/entities/user.entity';

@ObjectType()
@Entity()
@Index('idx_reciver_id', ['reciver'])
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
  @Field(() => User, { nullable: true })
  @Column({ name: 'reciver', nullable: true })
  reciver?: string;
  @Field(() => Date)
  @Column()
  createdAt: Date;
  @Field()
  @Column({ default: false })
  isRead: boolean;
}
