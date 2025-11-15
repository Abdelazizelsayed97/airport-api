import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Employee } from "./entities/employee.entity";
import { Repository } from "typeorm";
import { UpdateEmployeeInput } from "./dto/update-employee.input";
import DataLoader from "dataloader";
import { CreateEmployeeInput } from "./dto/create-employee.input";
import { DataLoaderService } from "@app/dataloader/dataloader.service";

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private readonly dataLoaderService: DataLoaderService
  ) {}
  async assignEmployee(assignToFlightDto: CreateEmployeeInput) {
    const employee = await this.findOne(assignToFlightDto.user_id);
    if (!employee) {
      throw new NotFoundException("NotFound");
    }

    this.employeeRepository.create(employee);

    return await this.employeeRepository.save(employee);
  }

  async findAll() {
    return this.createEmployeesLoader();
  }

  createEmployeesLoader(): DataLoader<string, Employee> {
    return this.dataLoaderService.createLoader<string, Employee>(
      async (ids: readonly string[]) => {
        const employees = await this.employeeRepository.find({
          where: ids.length > 0 ? ids.map((id) => ({ id })) : undefined,
        });
        const employeeMap = new Map(employees.map((emp) => [emp.id, emp]));
        return ids.map(
          (id) => employeeMap.get(id) || new Error(`Employee not found: ${id}`)
        );
      }
    );
  }

  async findOne(id: string) {
    const employee = this.employeeRepository.findOneBy({ id });
    if (!employee) {
      throw new NotFoundException("NotFound");
    }
    return await this.employeeRepository.findOneBy({ id });
  }

  async update(updateEmployeeInput: UpdateEmployeeInput) {
    const employee = await this.findOne(updateEmployeeInput.id);
    if (!employee) {
      throw new NotFoundException("NotFound");
    }

    Object.assign(employee, updateEmployeeInput);
    return await this.employeeRepository.save(employee);
  }

  async remove(id: string) {
    return this.employeeRepository.delete(id);
  }
}
