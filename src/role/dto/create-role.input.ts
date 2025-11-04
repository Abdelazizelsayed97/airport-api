import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { action } from '@core/enums/permissions.action';

@InputType()
export class CreateRoleInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  name: string;
  @Field(() => [action])
  permissions: action[];
}
