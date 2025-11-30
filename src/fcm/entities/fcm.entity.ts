import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Entity,
  Index,
} from 'typeorm';

@ObjectType()
@Entity({ synchronize: true })
@Index('idx_user_id', ['user_id'])
export class Fcm {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: String;

  @Field()
  @Column()
  token: string;

  @Column()
  user_id: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  deviceInfo?: string;

  @Field(() => Boolean)
  @Column('boolean', { default: true })
  isActive: boolean;
}
