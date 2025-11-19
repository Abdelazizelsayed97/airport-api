import { Injectable } from "@nestjs/common";
import { FlightStaff } from "./entities/fight_staff.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateFightStaffInput } from "./dto/create-fight_staff.input";
import { UpdateFightStaffInput } from "./dto/update-fight_staff.input";
import { FlightMangementService } from "flight_mangement/flight_mangement.service";

import { EmployeesService } from "employee/employee.service";
import { sout } from "users/users.service";

@Injectable()
export class FightStaffService {
  constructor(
    @InjectRepository(FlightStaff)
    private fightStaffRepository: Repository<FlightStaff>,

    private flightMangementService: FlightMangementService,
    private employeeService: EmployeesService
  ) {}
  async assignMember(
    createFightStaffInput: CreateFightStaffInput
  ): Promise<FlightStaff> {
    const flight = await this.flightMangementService.findOne(
      createFightStaffInput.fight_id
    );
    if (!flight) {
      throw new Error("This flight doesn't exist or departed");
    }
    const employees = await this.employeeService.getUserIdsByFilter(
      createFightStaffInput.employeeIds
    );

    const getEmployes = employees.filter((emp) =>
      createFightStaffInput.employeeIds.includes(emp.id)
    );
    if (getEmployes.map((emp) => emp.assigned_flights) !== null) {
      throw new Error("this employee is already assigned");
    }

    const staff = this.fightStaffRepository.create({
      flight: flight,
      employees: getEmployes,
    });
    return await this.fightStaffRepository.save({
      ...staff,
    });
  }

  async findAll(): Promise<FlightStaff[]> {
    return await this.fightStaffRepository.find({
      relations: ["flight", "employees"],
    });
  }

  async findOne(id: String): Promise<FlightStaff> {
    const flightStaff = await this.fightStaffRepository.findOne({
      where: { id: id as string },
      relations: ["flight", "employees"],
    });
    if (!flightStaff) {
      throw new Error("Invalid input");
    }
    return flightStaff;
  }

  async update(
    id: string,
    updateFightStaffInput: UpdateFightStaffInput
  ): Promise<FlightStaff> {
    const currentFlightStaff = await this.fightStaffRepository.findOne({
      where: { id: id },
      relations: ["flight", "employees"],
    });
    if (!currentFlightStaff) {
      throw new Error("Invalid input");
    }

    if (updateFightStaffInput.employeeIds) {
      const employees = await this.employeeService.getUserIdsByFilter(
        updateFightStaffInput.employeeIds
      );
      

      const getEmployes = employees.filter((emp) =>
        updateFightStaffInput.employeeIds?.includes(emp.id)
      );
      currentFlightStaff.employees = getEmployes;
    }

    Object.assign(currentFlightStaff, updateFightStaffInput);

    return this.fightStaffRepository.save(currentFlightStaff);
  }

  async remove(id: string): Promise<FlightStaff> {
    const flightMember = await this.fightStaffRepository.findOne({
      where: { id: id },
    });
    if (!flightMember) {
      throw new Error("Flight staff member not found");
    }
    return this.fightStaffRepository.remove(flightMember);
  }
}
