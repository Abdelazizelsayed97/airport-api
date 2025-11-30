import { Module } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { BookingResolver } from "./booking.resolver";
import { Booking } from "./entities/book.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "users/users.module";
import { FlightMangementModule } from "flight_mangement/flight_mangement.module";

@Module({
  providers: [BookingResolver, BookingService],
  exports: [BookingService],
  imports: [
    TypeOrmModule.forFeature([Booking]),
    UserModule,
    FlightMangementModule,
  ],
})
export class BookingModule {}
