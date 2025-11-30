import { Args, Resolver, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import FlightEntity from "../entities/flight.entity";

import { UseGuards } from "@nestjs/common";
import { PermissionsGuard } from "permissions/guard/permissions.guard";

export const pubSub = new PubSub();

UseGuards(PermissionsGuard);
@Resolver(() => FlightEntity)
export class flightSubscriptionResolver {
  @Subscription(() => FlightEntity, {
    name: "flightStatus",
    filter: (payload, variables, ctx) => {
      if (!ctx.user) return false;
      return payload.flightStatus.bookings
        ?.map((book) => book.user.id)
        .includes(ctx.user.id);
    },
  })
  async flightStatus() {
    return pubSub.asyncIterableIterator("flightStatus");
  }
}
