import { Module } from '@nestjs/common';
import { FightStaffService } from './fight_staff.service';
import { FightStaffResolver } from './fight_staff.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightStaff } from './entities/fight_staff.entity';
import { FlightMangementModule } from 'src/flight_mangement/flight_mangement.module';

@Module({
  providers: [FightStaffResolver, FightStaffService],
  imports: [TypeOrmModule.forFeature([FlightStaff]), FlightMangementModule],
  exports: [FightStaffService],
})
export class FightStaffModule {}
