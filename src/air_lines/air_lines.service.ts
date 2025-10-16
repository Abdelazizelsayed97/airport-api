import { Injectable } from '@nestjs/common';
import { CreateAirLineInput } from './dto/create-air_line.input';
import { UpdateAirLineInput } from './dto/update-air_line.input';
import PaginationInput from 'src/pagination/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AirLine } from './entities/air_line.entity';
import { Repository } from 'typeorm';

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

  findAll(paginationInput: PaginationInput) {
    return `This action returns all airLines`;
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
