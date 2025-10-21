import { Repository } from 'typeorm';
import FlightEntity from '../entities/flight.entity';

export class FlightSubscriptionServices {
  constructor(private readonly repo: Repository<FlightEntity>) {}

  flightSynconization() {
    return this.repo.find();
  }
}
