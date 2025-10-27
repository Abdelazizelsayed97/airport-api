import { InputType, Field, PartialType } from '@nestjs/graphql';
import { RegisterInput } from './sign-up.input';

@InputType()
export class UpdateUserInput extends PartialType(RegisterInput) {
  @Field(() => String)
  id: string;
}
