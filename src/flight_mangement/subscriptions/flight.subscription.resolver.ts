import { Resolver, Subscription } from '@nestjs/graphql';
import FlightMangementEntity from '../entities/flight_mangement.entity';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(() => FlightMangementEntity)
export class AuthorResolver {
  @Subscription(() => FlightMangementEntity)
  synchornizedFlights() {
    return pubSub.asyncIterableIterator('flightSynconization');
  }
}
