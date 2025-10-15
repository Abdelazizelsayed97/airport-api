import { Repository } from 'typeorm';
import FlightMangementEntity from '../entities/flight_mangement.entity';

export class FlightSubscriptionServices {
  constructor(private readonly repo: Repository<FlightMangementEntity>) {}

  flightSynconization() {
    return this.repo.find();
  }
}
