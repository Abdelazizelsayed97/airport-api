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
import { Fcm } from 'fcm/entities/fcm.entity';
import { Notifcation } from '../../notifcation/entities/notifcation.entity';

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

  @Field()
  @Exclude()
  @Column()
  password: string;

  @Field(() => [Book], { nullable: true })
  @OneToMany(() => Book, (booking) => booking.user, { nullable: true })
  bookingList?: Book[];

  @Field(() => String)
  @Column()
  token: string;
  @Field(() => [Fcm], { nullable: true })
  @OneToMany(() => Fcm, (fcm) => fcm.user, { nullable: true })
  fcm?: Fcm[];

  @OneToMany(() => Notifcation, (notification) => notification.reciver)
  sentNotifications: Notifcation[];

  @OneToMany(() => Notifcation, (notification) => notification.reciver)
  receivedNotifications: Notifcation[];
  @Column({ default: false })
  verificationCode : string;
}
