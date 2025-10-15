import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { Book } from './entities/book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Roles } from 'src/auth/decorators/auth.decorator';
import { UsersRoles } from 'src/enums/user.roles';

import { UsersServices } from 'src/users/users.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
    readonly userService: UsersServices,
  ) {}
  @UseGuards(AuthGuard)
  @Roles(UsersRoles.passenger)
  async create(createBookInput: CreateBookInput): Promise<Book> {
    console.log(createBookInput);
    const user = await this.userService.findOne(createBookInput.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const book = this.bookRepository.create({
      ...createBookInput,
      user: user,
    } as Partial<Book>);

    const saved = await this.bookRepository.save(book);

    return saved;
  }

async findAll(): Promise<Book[]> {
    const books =await this.bookRepository.find({ relations: ['user'] });
    console.log(books);
    if (!books) {
      throw new Error('No bookings found');
    }
    return books;
  }

  async findOne(id: string) {
    const book = await this.bookRepository.findOne({
      where: { id: Number(id) },
      relations: ['user'],
    });
    if (!book) {
      throw new Error("This booking doesn't exist");
    }
    return book;
  }

  async update(id: string, updateBookInput: UpdateBookInput) {
    const book = await this.findOne(id);
    if (!book) {
      throw new NotFoundException();
    }
    Object.assign(book, updateBookInput);
    return await this.bookRepository.save(book);
  }

  async remove(id: number) {
    return await this.bookRepository.delete(id);
  }
}
