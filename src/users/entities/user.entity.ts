import { ObjectType, Field } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { Book } from '../../book/entities/book.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';

@ObjectType()
@Entity({ synchronize: true })
export class User {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
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

  @Field(() => [Book], { nullable: true })
  @OneToMany(() => Book, (booking) => booking.user, { nullable: true })
  bookingList?: Book[];

  @Field(() => String)
  @Column()
  token: string;

  @Column({ default: false })
  verificationCode: string;
}
