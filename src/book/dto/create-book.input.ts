import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Observable } from 'rxjs';
import { UsersRoles } from 'src/enums/user.roles';
import { User } from 'src/users/entities/user.entity';

@InputType()
export class CreateBookInput {
  @Field(() => String)
  @IsString()
  flightNumber: string;

  @Field(() => UsersRoles, {})
  @Field(() => String)
  @IsString()
  seatNumber: string;
  @Field(() => String)
  @IsString()
  userId: string;
  @Field(() => UsersRoles)
  role: UsersRoles;
}

class testGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.switchToHttp().getRequest().role,
    );
    if (!requiredRoles) return true;
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];
    if (!token) return false;
    return true;
  }
}
