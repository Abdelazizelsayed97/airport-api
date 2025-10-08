import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesResolver } from './employees.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';

@Module({
  providers: [EmployeesResolver, EmployeesService],
  imports: [TypeOrmModule.forFeature([Employee])]
})
export class EmployeesModule {}
