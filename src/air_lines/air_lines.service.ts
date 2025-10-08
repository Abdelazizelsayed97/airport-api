import { Injectable } from '@nestjs/common';
import { CreateAirLineInput } from './dto/create-air_line.input';
import { UpdateAirLineInput } from './dto/update-air_line.input';

@Injectable()
export class AirLinesService {
  create(createAirLineInput: CreateAirLineInput) {
    return 'This action adds a new airLine';
  }

  findAll() {
    return `This action returns all airLines`;
  }

  findOne(id: number) {
    return `This action returns a #${id} airLine`;
  }

  update(id: number, updateAirLineInput: UpdateAirLineInput) {
    return `This action updates a #${id} airLine`;
  }

  remove(id: number) {
    return `This action removes a #${id} airLine`;
  }
}
