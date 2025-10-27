import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreatePermissionInput } from 'permissions/dto/create-permission.input';
import { Permission } from 'permissions/entities/permission.entity';

@InputType()
export class CreateRoleInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  name: string;

  @Field(() => [CreatePermissionInput])
  permissions: CreatePermissionInput[];
}
