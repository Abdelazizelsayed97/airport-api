import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BookService } from './book.service';
import { Book } from './entities/book.entity';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { UseGuards } from '@nestjs/common';
import { UsersRoles } from '../enums/user.roles';
import { Roles } from '../auth/decorators/auth.decorator';
import { AuthGuard } from '../auth/guard/auth.guard';
import PaginationInput from '../pagination/pagination.dto';
import { RolesGuard } from '../users/users.guards/role.guard';
import { sout } from '../users/users.service';





@Resolver(() => Book)
export class BookResolver {
  constructor(private readonly bookService: BookService) {}

  @Roles(UsersRoles.passenger)
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Book)
  async createBook(
    @Args('createBookInput') createBookInput: CreateBookInput,
  ): Promise<Book> {
    sout(createBookInput.userId);

    return this.bookService.create(createBookInput);
  }

  @Query(() => [Book], { name: 'book' })
  findAll(
    @Args('pagination', { type: () => PaginationInput })
    pagination: PaginationInput,
    @Args('userId', { type: () => String, nullable: true })
    userId: string,
  ) {
    return this.bookService.findAll(userId, pagination);
  }

  @Query(() => [Book], { name: 'book' })
  findMyBook(@Args('flightId', { type: () => String }) flightId: string) {
    return this.bookService.findAllBooksForFlight(flightId);
  }

  @Query(() => Book, { name: 'book' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.bookService.findOne(id);
  }

  @Mutation(() => Book)
  updateBook(@Args('updateBookInput')  updateBookInput: UpdateBookInput) {
    return this.bookService.update(updateBookInput.id, updateBookInput);
  }

  @Mutation(() => Book)
  removeBook(@Args('id', { type: () => String }) id: string) {
    return this.bookService.remove(id);
  }
}

