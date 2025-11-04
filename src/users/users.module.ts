import { forwardRef, Module } from '@nestjs/common';
import { UsersServices } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BookModule } from 'book/book.module';
import { RoleModule } from 'role/role.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => BookModule),
    forwardRef(() => RoleModule),
  ],
  providers: [UsersResolver, UsersServices],
  exports: [UsersServices],
})
export class UsersModule {}
