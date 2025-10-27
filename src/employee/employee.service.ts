import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';

import { UpdateEmployeeInput } from './dto/update-employee.input';
import { UsersServices } from 'users/users.service';
import { AssignToFlightDto } from './dto/assign-to-flight.dto';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly usersService: UsersServices,
    @Inject(forwardRef(() => UsersServices))
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}
  async assignEmployee(assignToFlightDto: AssignToFlightDto) {
    const employee = await this.findOne(assignToFlightDto.employeeId);
    if (!employee) {
      throw new NotFoundException('NotFound');
    }

    const user = await this.usersService.findOne(employee.users.id);

    await this.employeeRepository.update(
      assignToFlightDto.employeeId,
      employee,
    );

    return employee;
  }

  async findAll() {
    return await this.employeeRepository.find();
  }

  async findOne(id: string) {
    const employee = this.employeeRepository.findOneBy({ id });
    if (!employee) {
      throw new NotFoundException('NotFound');
    }

    return await this.employeeRepository.findOneBy({ id });
  }

  async update(updateEmployeeInput: UpdateEmployeeInput) {
    return `This action updates a #${updateEmployeeInput.id} employee`;
  }

  async remove(id: string) {
    return this.employeeRepository.delete(id);
  }
}
