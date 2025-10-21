import { InputType, Field, PartialType } from '@nestjs/graphql';
import { SignUpDto } from './sign-up.input';

@InputType()
export class UpdateUserInput extends PartialType(SignUpDto) {
  @Field(() => String)
  id: string;
}
