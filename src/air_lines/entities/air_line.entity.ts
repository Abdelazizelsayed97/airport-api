import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

@ObjectType()
  @Entity({synchronize:true})
export class AirLine {
  @Field(() => Int)
    @Column()
  id: number;
  @Field(() => String)
    @Column()
  name: string;
  @Field(() => String)
    @Column()
  country: string;  
}
