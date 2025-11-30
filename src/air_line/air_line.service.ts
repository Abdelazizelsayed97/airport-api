import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AirLine } from "./entities/air_line.entity";
import { Repository } from "typeorm";

import { CreateAirLineInput } from "./dto/create-air_line.input";
import { UpdateAirLineInput } from "./dto/update-air_line.input";
import PaginationInput from "pagination/pagination.dto";

import DataLoader from "dataloader";

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

  async findAll(
    paginationInput: PaginationInput = {
      page: 1,
      limit: 10,
    }
  ): Promise<AirLine[]> {
    return await this.airLineRepository.find({
      skip: (paginationInput.page! - 1) * paginationInput.limit || 0,
      take: paginationInput.limit,
    });
  }



  async findOne(id: string) {
    const airline = await this.airLineRepository.findOne({ where: { id: id } });
    if (!airline) {
      throw new Error("AirLine not found");
    }
    return airline;
  }

  async update(id: string, updateAirLineInput: UpdateAirLineInput) {
    const airline = await this.findOne(updateAirLineInput.id);
    if (!airline) {
      throw new Error("AirLine not found");
    }
    Object.assign(airline, updateAirLineInput);
    return await this.airLineRepository.save(airline);
  }

  async remove(id: string) {
    await this.airLineRepository.delete(id);
  }
}
