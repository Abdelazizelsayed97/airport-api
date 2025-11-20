import DataLoader from "dataloader";
import { DataSource } from "typeorm";
import { User } from "users/entities/user.entity";

export const userLoader = (dataSource: DataSource) => {
  return new DataLoader<string, User>(async (ids: readonly string[]) => {
    const users = await dataSource
      .getRepository(User)
      .createQueryBuilder("user")
      .whereInIds(ids)
      .getMany();

    const userMap = new Map(users.map((user) => [user.id, user]));
    return ids.map(
      (id) => userMap.get(id) || new Error(`User not found: ${id}`)
    );
  });
};
