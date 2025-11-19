import DataLoader from "dataloader";
import { DataSource } from "typeorm";
import { Booking } from "booking/entities/book.entity";

export const userBookingsLoader = (dataSource: DataSource) => {
  return new DataLoader<string, Booking[]>(
    async (userIds: readonly string[]) => {
      const bookings = await dataSource
        .getRepository(Booking)
        .createQueryBuilder("book")
        .leftJoinAndSelect("book.user", "user")
        .where("user.id IN (:...userIds)", { userIds: [...userIds] })
        .leftJoinAndSelect("book.flight", "flight")
        .getMany();

      const bookingsMap = new Map<string, Booking[]>();
      userIds.forEach((id) => bookingsMap.set(id, []));

      bookings.forEach((booking) => {
        if (booking.user && booking.user.id) {
          bookingsMap.get(booking.user.id)?.push(booking);
        }
      });

      return userIds.map((id) => bookingsMap.get(id) || []);
    }
  );
};
