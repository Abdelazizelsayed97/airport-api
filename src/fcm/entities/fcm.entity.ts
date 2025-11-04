import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PrimaryGeneratedColumn, Column, ManyToOne, Entity } from 'typeorm';
import { User } from 'users/entities/user.entity';

@ObjectType()
@Entity({ synchronize: true })
export class Fcm {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: String;

  @Field()
  @Column()
  token: string;

  @ManyToOne(() => User, (user) => user.fcm, { onDelete: 'CASCADE' })
  user: User;

  @Field({ nullable: true })
  @Column({ nullable: true })
  deviceInfo?: string;

  @Field(() => Boolean)
  @Column('boolean', { default: true })
  isActive: boolean;
}
