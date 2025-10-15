import { SignUpDto } from './sign-up.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(SignUpDto) {
  @Field(() => String)
  id: string;
}
