import { ObjectType, Field } from '@nestjs/graphql';
import { Role } from 'role/entities/role.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;
  @Column()
  @Field(() => String)
  permission: string;
  @Column()
  @Field(() => String)
  description: string;
  @Field(() => [Role])
  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
