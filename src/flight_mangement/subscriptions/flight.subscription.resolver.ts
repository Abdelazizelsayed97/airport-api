import { Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import FlightEntity from '../entities/flight.entity';

export const pubSub = new PubSub();

@Resolver(() => FlightEntity)
export class flightSubscriptionResolver {
  @Subscription(() => FlightEntity, {
    name: 'flightStatus',
  })
  async flightStatus() {
    return pubSub.asyncIterableIterator('flightStatus');
  }
}
