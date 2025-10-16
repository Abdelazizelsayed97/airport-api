import { Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import FlightEntity from '../entities/flight.entity';

const pubSub = new PubSub();

@Resolver(() => FlightEntity)
export class AuthorResolver {
  @Subscription(() => FlightEntity)
  synchornizedFlights() {
    return pubSub.asyncIterableIterator('flightSynconization');
  }
}
