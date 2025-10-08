import { Injectable } from '@nestjs/common';
import { CreateFightStaffInput } from './dto/create-fight_staff.input';
import { UpdateFightStaffInput } from './dto/update-fight_staff.input';

@Injectable()
export class FightStaffService {
  create(createFightStaffInput: CreateFightStaffInput) {
    return 'This action adds a new fightStaff';
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
