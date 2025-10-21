import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AirLine } from './entities/air_line.entity';
import { Repository } from 'typeorm';

import { CreateAirLineInput } from './dto/create-air_line.input';
import { UpdateAirLineInput } from './dto/update-air_line.input';
import PaginationInput from 'pagination/pagination.dto';

@Injectable()
export class AirLinesService {
  constructor(
    @InjectRepository(AirLine) private airLineRepository: Repository<AirLine>,
  ) {}
  async create(createAirLineInput: CreateAirLineInput): Promise<AirLine> {
    if (createAirLineInput.name && createAirLineInput.country) {
      return await this.airLineRepository.save(createAirLineInput);
    }
    return {} as AirLine;
  }

  findAll(
    paginationInput: PaginationInput /**paginationInput: PaginationInput */,
  ) {
    return this.airLineRepository.find();
  }

  findOne(id: string) {
    return `This action returns a #${id} airLine`;
  }

  update(id: string, updateAirLineInput: UpdateAirLineInput) {
    return `This action updates a #${id} airLine`;
  }

  remove(id: string) {
    return `This action removes a #${id} airLine`;
  }
}
