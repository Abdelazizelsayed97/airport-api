import { Module } from '@nestjs/common';
import { EmployeesService } from './employee.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { EmployeesResolver } from './employee.resolver';
import { UsersModule } from 'users/users.module';

@Module({
  providers: [EmployeesResolver, EmployeesService],
  imports: [TypeOrmModule.forFeature([Employee]), UsersModule],
})
export class EmployeesModule {}
