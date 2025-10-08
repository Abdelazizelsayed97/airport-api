import { Module } from '@nestjs/common';
import { AuthServices } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User])],
  providers: [UsersResolver, AuthServices],
  exports: [AuthServices]
})
export class UsersModule { }
