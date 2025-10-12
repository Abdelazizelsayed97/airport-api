import { Injectable, UseGuards } from '@nestjs/common';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { Book } from './entities/book.entity';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/auth.decorator';
import { UsersRoles } from 'src/enums/user.roles';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
  ) {}
  @UseGuards(AuthGuard)
  @Roles(UsersRoles.passenger)
  async create(createBookInput: CreateBookInput): Promise<Book> {
    const book = Object.assign(new Book(), createBookInput);

    return await this.bookRepository.save(book);
  }

  findAll() {
    const books = this.bookRepository.find({ relations: ['user'] });
    console.log(books);
    if (!books) {
      throw new Error('No bookings found');
    }
    return books;
  }

  findOne(id: number) {
    return `This action returns a #${id} book`;
  }

  update(id: number, updateBookInput: UpdateBookInput) {
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
