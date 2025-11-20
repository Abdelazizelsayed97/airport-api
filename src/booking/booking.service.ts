import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateBookInput } from "./dto/create-book.input";
import { UpdateBookInput } from "./dto/update-book.input";
import { Booking } from "./entities/book.entity";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { UserService } from "../users/users.service";
import { FlightMangementService } from "../flight_mangement/flight_mangement.service";
import PaginationInput from "../pagination/pagination.dto";
import { flight_status } from "@core/enums/flight.status";

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking) private bookRepository: Repository<Booking>,
    private readonly usersService: UserService,
    private readonly flightService: FlightMangementService
  ) {}
  async create(createBookInput: CreateBookInput): Promise<Booking> {
    const user = await this.usersService.findOne(createBookInput.userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const flight = await this.flightService.findOne(createBookInput.flightId);
    if (!flight) {
      throw new NotFoundException("Flight not found");
    }
    const isBooked = await this.bookRepository
      .createQueryBuilder("book")
      .where("book.flightId = :flightId", {
        flightId: createBookInput.flightId,
      })
      .andWhere("book.userId = :userId", { userId: createBookInput.userId })
      .getOne();
    if (isBooked) {
      throw new Error("You have already booked on this flight");
    }

    const isExist = await this.bookRepository
      .createQueryBuilder("book")
      .where("book.flightId = :flightId", {
        flightId: createBookInput.flightId,
      })
      .andWhere("book.seatNumber = :seatNumber", {
        seatNumber: createBookInput.seatNumber,
      })
      .getOne();
    if (isExist) {
      throw new Error("This seat is already booked on this flight");
    }
    if (flight.flight_status !== flight_status.delayed) {
      throw new Error("This flight is already departed");
    }

    const book = this.bookRepository.create({
      seatNumber: createBookInput.seatNumber,
      user: user,
      flight: flight,
    });

    const newBook = await this.bookRepository.save(book);

    return newBook;
  }

  async findAll(paginate?: PaginationInput) {
    return await this.bookRepository.find({
      take: paginate?.limit,
      skip: paginate ? ((paginate.page || 1) - 1) * paginate.limit : 0,
    });
  }

  async findAllBooksForFlight(flightId: string): Promise<Booking[]> {
    const allBook = await this.bookRepository.find({
      where: {
        flight: { id: flightId },
      },
    });
    return allBook;
  }

  async findOne(id: string) {
    const book = await this.bookRepository.findOne({
      where: { id: id },
      relations: ["user"],
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
