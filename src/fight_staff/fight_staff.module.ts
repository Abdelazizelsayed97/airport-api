import { Module } from '@nestjs/common';
import { FightStaffService } from './fight_staff.service';
import { FightStaffResolver } from './fight_staff.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightStaff } from './entities/fight_staff.entity';
import { FlightMangementModule } from 'flight_mangement/flight_mangement.module';
import { UserModule } from 'users/users.module';
import { Employee } from 'employee/entities/employee.entity';
import { EmployeeModule } from 'employee/employee.module';


 /// This module is responsible for managing flight staff ,
 // and oprations like assigning staff to a flight or change the flight staff members
 
@Module({
  providers: [FightStaffResolver, FightStaffService],
  imports: [
    TypeOrmModule.forFeature([FlightStaff, Employee]),
    FlightMangementModule,
    UserModule,
    EmployeeModule,
  ],
  exports: [FightStaffService],
})
export class FightStaffModule {}
