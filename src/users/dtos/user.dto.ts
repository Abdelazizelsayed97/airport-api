import { Expose } from 'class-transformer';
import { Book } from 'src/book/entities/book.entity';

export class UserDto {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Expose()
  email: string;
  @Expose()
  bookingList?: Book[];
}
