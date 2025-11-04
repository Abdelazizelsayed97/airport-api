import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { Book } from './entities/book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRoles } from '../core/enums/user.roles';

import { Repository } from 'typeorm';

import { UsersServices } from '../users/users.service';
import PaginationInput from '../pagination/pagination.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,

    @Inject(forwardRef(() => UsersServices))
    private readonly usersService: UsersServices,
  ) {}

  async create(createBookInput: CreateBookInput): Promise<Book> {
    const user = await this.usersService.findOne(createBookInput.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // if (user.role !== UsersRoles.passenger) {
    //   throw new NotFoundException('Forbidden');
    // }

    const book = this.bookRepository.create({
      ...createBookInput,
      user: user,
    } as Partial<Book>);

    const newBook = await this.bookRepository.save(book);

    return newBook;
  }

  findAll(id: string, paginate: PaginationInput) {
    return this.bookRepository.find();
  }

  async findAllBooksForFlight(flightId: string): Promise<Book[]> {
    const allBook = await this.bookRepository.find({
      where: {},
      relations: ['user'],
    });
    return allBook.filter((book) => {
      return book.id === flightId;
    });
  }

  async findOne(id: string) {
    const book = await this.bookRepository.findOne({
      where: { id: id },
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

  async remove(id: string) {
    if (!id) {
      throw new NotFoundException();
    }
    return await this.bookRepository.delete(id);
  }
}
