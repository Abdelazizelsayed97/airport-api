import { Injectable } from "@nestjs/common";
import { FlightStaff } from "./entities/fight_staff.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateFightStaffInput } from "./dto/create-fight_staff.input";
import { UpdateFightStaffInput } from "./dto/update-fight_staff.input";
import { FlightMangementService } from "flight_mangement/flight_mangement.service";
import { Employee } from "employee/entities/employee.entity";
import { DataLoaderService } from "@app/dataloader/dataloader.service";
import DataLoader from "dataloader";

@Injectable()
export class FightStaffService {
  constructor(
    @InjectRepository(FlightStaff)
    private fightStaffRepository: Repository<FlightStaff>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private flightMangementService: FlightMangementService,
    private readonly dataLoaderService: DataLoaderService
  ) {}
  async assignMember(
    createFightStaffInput: CreateFightStaffInput
  ): Promise<FlightStaff> {
    if (!createFightStaffInput) {
      throw new Error("Invalid input");
    }

    const flight = await this.flightMangementService.findOne(
      createFightStaffInput.fight_id
    );

    const employees = await this.employeeRepository.findByIds(
      createFightStaffInput.employeeIds
    );

    const staff = this.fightStaffRepository.create({
      ...createFightStaffInput,
      flight: flight,
      employees: employees,
    });

    return this.fightStaffRepository.save(staff);
  }

  async findAll(): Promise<FlightStaff[]> {
    return await this.fightStaffRepository.find({
      relations: ["flight", "employees"],
    });
  }

  createFlightStaffsLoader(): DataLoader<string, FlightStaff> {
    return this.dataLoaderService.createLoader<string, FlightStaff>(
      async (ids:  string[]) => {
        const staffs = await this.fightStaffRepository.find({
          where: ids.length > 0 ? ids.map((id) => ({ id })) : undefined,
          relations: ["flight", "employees"],
        });
        const staffMap = new Map(staffs.map((staff) => [staff.id, staff]));
        return ids.map(
          (id) => staffMap.get(id)!
        );
      }
    );
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
      currentFlightStaff.employees = await this.employeeRepository.findByIds(
        updateFightStaffInput.employeeIds
      );
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
