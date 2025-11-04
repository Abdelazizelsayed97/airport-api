import { Field, ObjectType } from '@nestjs/graphql';
import { action } from '@core/enums/permissions.action';
import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from 'typeorm';
import { User } from 'users/entities/user.entity';
@Entity({ synchronize: true })
@ObjectType()
export class Role {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column('text', { unique: true })
  name: string;

  @Field(() => [action])
  @Column('enum', {
    array: true,
    default: [],
    enum: action,
    enumName: 'action',
  })
  permissions: action[];

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
