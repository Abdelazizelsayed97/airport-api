import { Module } from '@nestjs/common';
import { UsersServices } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BookModule } from 'book/book.module';
import { RoleModule } from 'role/role.module';
import { EmailModule } from 'email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    BookModule,
    RoleModule,
    EmailModule,
  ],
  providers: [UsersResolver, UsersServices],
  exports: [UsersServices],
})
export class UsersModule {}
