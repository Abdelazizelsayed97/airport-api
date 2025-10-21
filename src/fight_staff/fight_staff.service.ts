import { Injectable } from '@nestjs/common';
import { FlightStaff } from './entities/fight_staff.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFightStaffInput } from './dto/create-fight_staff.input';
import { UpdateFightStaffInput } from './dto/update-fight_staff.input';
import { FlightMangementService } from 'flight_mangement/flight_mangement.service';

@Injectable()
export class FightStaffService {
  constructor(
    @InjectRepository(FlightStaff)
    private fightStaffRepository: Repository<FlightStaff>,
    private flightMangementService: FlightMangementService,
  ) {}
  assignMember(createFightStaffInput: CreateFightStaffInput): FlightStaff {
    // const flight = await this.flightRepository.findOne({
    //   where: { id: createFightStaffInput.flightId },
    // });
    if (!createFightStaffInput) {
      throw new Error('Invalid input');
    }
    const flight = this.flightMangementService.findOne(
      createFightStaffInput.fight_id,
    );
    const staff = this.fightStaffRepository.create({
      ...createFightStaffInput,
      ...flight,
    });
    this.fightStaffRepository.save({
      ...createFightStaffInput,
    });
    return staff;
  }

  findAll() {
    return `This action returns all fightStaff`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fightStaff`;
  }

  async update(id: string, updateFightStaffInput: UpdateFightStaffInput) {
    const currentFlight = await this.fightStaffRepository.findOne({
      where: { id: id },
      relations: ['flight'],
    });
    if (!currentFlight) {
      throw new Error('Invalid input');
    }
    const flight = Object.assign(id, updateFightStaffInput);

    return this.fightStaffRepository.save({
      flight,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} fightStaff`;
  }
}
