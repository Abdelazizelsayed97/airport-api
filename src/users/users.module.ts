import { forwardRef, Module } from '@nestjs/common';
import { UsersServices } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BookModule } from 'book/book.module';
import { RoleModule } from 'role/role.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => BookModule),
    forwardRef(() => RoleModule),

    JwtModule.register({
      secret: 'your-secret-key', // Replace with your actual secret key
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [UsersResolver, UsersServices],
  exports: [UsersServices],
})
export class UsersModule {}
