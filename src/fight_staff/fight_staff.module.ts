import { Module } from '@nestjs/common';
import { FightStaffService } from './fight_staff.service';
import { FightStaffResolver } from './fight_staff.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightStaff } from './entities/fight_staff.entity';

@Module({
  providers: [FightStaffResolver, FightStaffService],
  imports: [TypeOrmModule.forFeature([FlightStaff])]
})
export class FightStaffModule {}
