import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from "@nestjs/graphql";
import { BookingService } from "./booking.service";
import { Booking as Booking } from "./entities/book.entity";
import { CreateBookInput } from "./dto/create-book.input";
import { UpdateBookInput } from "./dto/update-book.input";
import { UseGuards } from "@nestjs/common";
import { Roles } from "../auth/decorators/auth.decorator";
import { AuthGuard } from "../auth/guard/auth.guard";
import PaginationInput from "../pagination/pagination.dto";
import { sout } from "../users/users.service";
import { UsersRoles } from "@core/enums/user.roles";
import DataLoader from "dataloader";
import { User } from "../users/entities/user.entity";
import { userLoader } from "../core/loaders/user.loader";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { IsVerifiedGuard } from "@core/common/isverified.guard";

@Resolver(() => Booking)
export class BookingResolver {
  private userLoaderInstance: DataLoader<string, User>;

  constructor(
    private readonly bookService: BookingService,
    @InjectDataSource() private dataSource: DataSource
  ) {
    this.userLoaderInstance = userLoader(this.dataSource);
  }

  @Roles(UsersRoles.user)
  @UseGuards(AuthGuard, IsVerifiedGuard)
  @Mutation(() => Booking)
  async createBook(
    @Args("createBookInput") createBookInput: CreateBookInput
  ): Promise<Booking> {
    sout(createBookInput.userId);

    return this.bookService.create(createBookInput);
  }

  @Query(() => [Booking], { name: "getAllBooks" })
  getAllBooks(
    @Args("pagination", { type: () => PaginationInput, nullable: true })
    pagination?: PaginationInput
  ) {
    return this.bookService.findAll(pagination);
  }

  @Query(() => [Booking], { name: "booksforflight" })
  booksforflight(@Args("flightId", { type: () => String }) flightId: string) {
    return this.bookService.findAllBooksForFlight(flightId);
  }

  @Query(() => Booking, { name: "book" })
  findOne(@Args("id", { type: () => String }) id: string) {
    return this.bookService.findOne(id);
  }

  @Mutation(() => Booking)
  updateBook(@Args("updateBookInput") updateBookInput: UpdateBookInput) {
    return this.bookService.update(updateBookInput.id, updateBookInput);
  }

  @Mutation(() => Booking)
  removeBook(@Args("id", { type: () => String }) id: string) {
    return this.bookService.remove(id);
  }

  @ResolveField(() => User)
  async user(@Parent() book: Booking) {
    sout("book: " + JSON.stringify(book));
    return this.dataSource
      .getRepository(User)
      .createQueryBuilder("user")
      .innerJoin("user.bookingList", "booking")
      .where("booking.id = :id", { id: book.id })
      .getOne();
  }
}
