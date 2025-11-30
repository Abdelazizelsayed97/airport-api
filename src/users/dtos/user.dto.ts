import { Booking } from "booking/entities/book.entity";
import { Expose } from "class-transformer";

export class UserDto {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Expose()
  email: string;
  @Expose()
  bookingList?: Booking[];
}
