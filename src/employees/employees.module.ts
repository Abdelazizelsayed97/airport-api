import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { EmployeesResolver } from './employees.resolver';
import { UsersModule } from 'users/users.module';

@Module({
  providers: [EmployeesResolver, EmployeesService],
  imports: [TypeOrmModule.forFeature([Employee]), UsersModule],
})
export class EmployeesModule {}
