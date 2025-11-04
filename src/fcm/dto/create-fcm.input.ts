import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateFcmInput {
  @Field()
  token: string;

  @Field()
  user_id: string;

  @Field({ nullable: true })
  deviceInfo?: string;

  @Field()
  isActive: boolean;
}
