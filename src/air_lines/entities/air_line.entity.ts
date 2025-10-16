import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({ synchronize: true })
export class AirLine {
  @Field(() => String)
  @PrimaryGeneratedColumn()
  id: string;
  @Field(() => String)
  @Column()
  name: string;
  @Field(() => String)
  @Column()
  country: string;
}
