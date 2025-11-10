import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookResolver } from './book.resolver';
import { Book } from './entities/book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'users/users.module';

@Module({
  providers: [BookResolver, BookService],
  exports: [BookService],
  imports: [TypeOrmModule.forFeature([Book]), UserModule],
})
export class BookModule {}
