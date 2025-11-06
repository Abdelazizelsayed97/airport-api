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

  async findAll() {
    return await this.fightStaffRepository.find({ relations: ['flight'] });
  }

  async findOne(id: String) {
    const flight = await this.fightStaffRepository.findOne({
      where: { id: id as string },
      relations: ['flight'],
    });
    if (!flight) {
      throw new Error('Invalid input');
    }
    return flight;
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
