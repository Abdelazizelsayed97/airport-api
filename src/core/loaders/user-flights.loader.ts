import { Booking } from "booking/entities/book.entity";
import DataLoader from "dataloader";
import { DataSource } from "typeorm";

export const userFlightLoader = (dataSource: DataSource) => {
  return new DataLoader<string, Booking[]>(async (ids: readonly string[]) => {
    const bookings = await dataSource
      .getRepository(Booking)
      .createQueryBuilder("book")
      .where("book.userId IN (:...userId)", {
        userId: [...ids],
      })
      .leftJoinAndSelect("book.flight", "flight")
      .leftJoinAndSelect("book.user", "user")
      .getMany();

    const bookingsMap = new Map<string, Booking[]>();
    ids.forEach((id) =>
      bookingsMap.set(
        id,
        bookings.filter((book) => book?.user.id === id)
      )
    );

    return ids.map((id) => bookingsMap.get(id) || []);
  });
};
