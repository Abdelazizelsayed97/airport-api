import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { Book } from 'src/book/entities/book.entity';
import { UsersRoles } from 'src/enums/user.roles';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ synchronize: true })
@ObjectType()
export class User {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => String)
  @Column()
  email: string;
  @Field(() => String)
  @Column()
  name: string;
  @Field(() => UsersRoles)
  @Column({
    type: 'enum',
    enum: UsersRoles,
    default: UsersRoles.passenger,
  })
  role: UsersRoles;
  @Field()
  @Column()
  @Exclude()
  password: string;
  @Field(() => [Book], { nullable: true })
  @OneToMany(() => Book, (booking) => booking.user)
  bookingList?: Book[];
  @Field(() => String)
  @Column()
  token: string;
}
