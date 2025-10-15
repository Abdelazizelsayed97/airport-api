import { Module } from '@nestjs/common';
import { FlightMangementService } from './flight_mangement.service';
import { FlightMangementResolver } from './flight_mangement.resolver';
import FlightMangementEntity from './entities/flight_mangement.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [FlightMangementResolver, FlightMangementService],
  exports: [FlightMangementService],
  imports: [TypeOrmModule.forFeature([FlightMangementEntity])],
})
export class FlightMangementModule {}
