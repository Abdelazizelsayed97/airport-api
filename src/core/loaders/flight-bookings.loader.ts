import DataLoader from "dataloader";
import { DataSource } from "typeorm";
import { Booking } from "booking/entities/book.entity";


export const BookingsLoader = (dataSource: DataSource) => {
  return new DataLoader<string, Booking[]>(
    async (flightIds: readonly string[]) => {
      const bookings = await dataSource
        .getRepository(Booking)
        .createQueryBuilder("book")
        .where("book.flightId IN (:...flightIds)", {
          flightIds: [...flightIds],
        })
        .leftJoinAndSelect("book.flight", "flight")

        .innerJoinAndSelect("book.user", "user")
        .getMany();


      const bookingsMap = new Map<string, Booking[]>();
      flightIds.forEach((id) =>
        bookingsMap.set(
          id,
          bookings.filter((book) => book.flight?.id === id)
        )
      );

      return flightIds.map((id) => bookingsMap.get(id) || []);
    }
  );
};
