import { SignUpDto } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(SignUpDto) {
  @Field(() => Int)
  id: number;
}
