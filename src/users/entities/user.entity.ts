import { ObjectType, Field } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { Book } from '../../book/entities/book.entity';
import { UsersRoles } from '../../enums/user.roles';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
  @Field(() => UsersRoles)
  @Column({
    // type: 'enum',
    // enum: UsersRoles,
  })
  role: string;

  @Field()
  @Column()
  @Exclude()
  password: string;
  @Field(() => [Book], { nullable: true })
  @OneToMany(() => Book, (booking) => booking.user, { nullable: true })
  bookingList?: Book[];
  @Field(() => String)
  @Column()
  token: string;
}
