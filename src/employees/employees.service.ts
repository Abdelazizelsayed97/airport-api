import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';
import { CreateEmployeeInput } from './dto/create-employee.input';
import { UpdateEmployeeInput } from './dto/update-employee.input';
import { UsersServices } from 'users/users.service';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly usersService: UsersServices,
    @Inject(forwardRef(() => UsersServices))
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}
  create(createEmployeeInput: CreateEmployeeInput) {
    const employee = this.employeeRepository.create(createEmployeeInput);
    this.employeeRepository.save(employee);
    return employee;
  }

  findAll() {
    return `This action returns all employees`;
  }

  findOne(id: string) {
    return `This action returns a #${id} employee`;
  }

  update(updateEmployeeInput: UpdateEmployeeInput) {
    
    return `This action updates a #${updateEmployeeInput.id} employee`;
  }

  remove(id: string) {
    return this.employeeRepository.delete(id);
  }
}
