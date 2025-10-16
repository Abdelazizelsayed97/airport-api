import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { BookService } from './book.service';
import { Book } from './entities/book.entity';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { Roles } from 'src/auth/decorators/auth.decorator';
import { UsersRoles } from 'src/enums/user.roles';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/users/users.guards/role.guard';
import PaginationInput from 'src/pagination/pagination.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Resolver(() => Book)
export class BookResolver {
  constructor(private readonly bookService: BookService) {}

  @Roles(UsersRoles.passenger)
  @UseGuards(RolesGuard, AuthGuard)
  @Mutation(() => Book)
  async createBook(
    @Args('createBookInput') createBookInput: CreateBookInput,
  ): Promise<Book> {
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
  findOne(@Args('id', { type: () => Int }) id: string) {
    return this.bookService.findOne(id);
  }

  @Mutation(() => Book)
  updateBook(@Args('updateBookInput') updateBookInput: UpdateBookInput) {
    return this.bookService.update(updateBookInput.id, updateBookInput);
  }

  @Mutation(() => Book)
  removeBook(@Args('id', { type: () => String }) id: string) {
    return this.bookService.remove(id);
  }
}
