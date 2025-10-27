import { Field, ObjectType } from '@nestjs/graphql';
import { Permission } from 'permissions/entities/permission.entity';
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToMany,
  JoinTable,
} from 'typeorm';
@Entity()
@ObjectType()
export class Role {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => String)
  @Column({ unique: true })
  name: string;
  @Field(() => [Permission], { nullable: true })
  @ManyToMany(() => Permission, (permission) => permission.roles)
  permissions: Permission[];
}
