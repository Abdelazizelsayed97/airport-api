import { Module } from '@nestjs/common';
import { UsersServices } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersResolver, UsersServices],
  exports: [UsersServices],
})
export class UsersModule {}
