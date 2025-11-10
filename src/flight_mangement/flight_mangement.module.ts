import { Module } from '@nestjs/common';
import { FlightMangementService } from './flight_mangement.service';
import { FlightMangementResolver } from './flight_mangement.resolver';

import { TypeOrmModule } from '@nestjs/typeorm';
import FlightEntity from './entities/flight.entity';
import { UserModule } from 'users/users.module';
import { flightSubscriptionResolver } from './subscriptions/flight.subscription.resolver';

@Module({
  providers: [
    FlightMangementResolver,
    FlightMangementService,
    flightSubscriptionResolver,
  ],
  exports: [FlightMangementService],
  imports: [TypeOrmModule.forFeature([FlightEntity]), UserModule],
})
export class FlightMangementModule {}
