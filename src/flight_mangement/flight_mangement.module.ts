import { Module } from '@nestjs/common';
import { FlightMangementService } from './flight_mangement.service';
import { FlightMangementResolver } from './flight_mangement.resolver';

import { TypeOrmModule } from '@nestjs/typeorm';
import FlightEntity from './entities/flight.entity';
import { UsersModule } from 'users/users.module';


@Module({
  providers: [FlightMangementResolver, FlightMangementService],
  exports: [FlightMangementService],
  imports: [TypeOrmModule.forFeature([FlightEntity]), UsersModule],
})
export class FlightMangementModule {}
