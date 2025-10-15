import { Injectable } from '@nestjs/common';
import { CreateFightStaffInput } from './dto/create-fight_staff.input';
import { UpdateFightStaffInput } from './dto/update-fight_staff.input';
import { FlightStaff } from './entities/fight_staff.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FlightMangementService } from 'src/flight_mangement/flight_mangement.service';

@Injectable()
export class FightStaffService {
  constructor(
    @InjectRepository(FlightStaff)
    private fightStaffRepository: Repository<FlightStaff>,
    private flightMangementService: FlightMangementService,
  ) {}
  assignMember(createFightStaffInput: CreateFightStaffInput): FlightStaff {
    const flight = this.flightMangementService.findOne(
      createFightStaffInput.fight_id,
    );
    if (!createFightStaffInput) {
      throw new Error('Invalid input');
    }
    const staff = this.fightStaffRepository.create({
      ...createFightStaffInput,
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

  update(id: number, updateFightStaffInput: UpdateFightStaffInput) {
    return `This action updates a #${id} fightStaff`;
  }

  remove(id: number) {
    return `This action removes a #${id} fightStaff`;
  }
}
