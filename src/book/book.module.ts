import { forwardRef, Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookResolver } from './book.resolver';
import { Book } from './entities/book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'users/users.module';

@Module({
  providers: [BookResolver, BookService],
  exports: [BookService],
  imports: [TypeOrmModule.forFeature([Book]), forwardRef(() => UsersModule)],
})
export class BookModule {}
