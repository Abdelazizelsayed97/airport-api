import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Book } from 'src/book/entities/book.entity';
import { UsersRoles } from 'src/enums/user.roles';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ synchronize: true })
@ObjectType()
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;
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
  password: string;
  @Field(() => [Book], { nullable: true })
  @OneToMany(() => Book, (booking) => booking.user)
  bookingList?: Book[];
}
