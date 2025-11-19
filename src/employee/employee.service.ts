import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Employee } from "./entities/employee.entity";
import { Repository } from "typeorm";
import { UpdateEmployeeInput } from "./dto/update-employee.input";
import { CreateEmployeeInput } from "./dto/create-employee.input";
import { UserService } from "users/users.service";

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private userService: UserService
  ) {}
  async assignEmployee(
    assignToFlightDto: CreateEmployeeInput
  ): Promise<Employee> {
    const user = await this.userService.findOne(assignToFlightDto.user_id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const employee = await this.employeeRepository.findOne({
      where: {
        user: {
          id: assignToFlightDto.user_id,
        },
      },
    });
    if (employee) {
      throw new NotFoundException("Employee already assigned");
    }

    const newEmployee = await this.employeeRepository.create({
      role: assignToFlightDto.role,
      user: user,
    });

    return await this.employeeRepository.save(newEmployee);
  }

  async findAll() {
    return await this.employeeRepository.find();
  }

  async findOne(id: string) {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException("NotFound");
    }
    return employee;
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
    const result = await this.employeeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException("Employee not found");
    }

    return {
      message: "Employee removed successfully",
    };
  }
  async getUserIdsByFilter(ids: string[]): Promise<Employee[]> {
    const rows = await this.employeeRepository
      .createQueryBuilder("employee")
      .leftJoinAndSelect("employee.user", "user")
      .select("employee.id")
      .where("employee.id IN (:...ids)", { ids })
      .getRawMany();

    return rows as  [];
  }
}
