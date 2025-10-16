import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFlightMangementInput } from './dto/create-flight_mangement.input';
import { UpdateFlightMangementInput } from './dto/update-flight_mangement.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import PaginationInput from 'src/pagination/pagination.dto';
import { FlightsFilterInput } from './dto/flight.filter.dto';
import FlightEntity from './entities/flight.entity';

@Injectable()
export class FlightMangementService {
  constructor(
    @InjectRepository(FlightEntity)
    private flightManageRepo: Repository<FlightEntity>,
  ) {}
  async create(input: CreateFlightMangementInput): Promise<FlightEntity> {
    if (!input) {
      throw new Error('Bad input');
    }
    const existing = await this.flightManageRepo.findOne({
      where: { flight_number: input.flight_number },
    });
    if (existing) {
      throw new Error('There is an existing flight');
    }
    let newFlight = this.flightManageRepo.create({
      ...input,
    });
    await this.flightManageRepo.save(newFlight);
    return newFlight;
  }

  async findAll(
    pagination: PaginationInput,
    filter: FlightsFilterInput,
  ): Promise<FlightEntity[]> {
    const where: Partial<FlightEntity> = {};
    Object.entries(filter || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        where[key] =
          typeof value === 'string'
            ? value
            : ((value as any).toString?.() ?? value);
      }
    });

    const [flights, count] = await this.flightManageRepo.findAndCount({
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
      where,
      relations: ['assigned'],
    });

    if (!flights || flights.length === 0) {
      throw new Error("This flight doesn't exist or departed");
    }
    return flights;
  }

  async findOne(id: string): Promise<FlightEntity> {
    const flight = await this.flightManageRepo.findOne({
      where: { id },
      relations: ['assigned'],
    });
    if (!flight) {
      throw new Error("This flight doesn't exist or departed");
    }
    return flight;
  }

  async update(
    id: string,
    updateFlightMangementInput: UpdateFlightMangementInput,
  ): Promise<FlightEntity> {
    if (!id) {
      throw new Error("Id can't be null");
    }
    const flight = await this.findOne(id);
    if (!flight) {
      throw new Error("This flight doesn't exist or departed");
    }
    Object.assign(flight, updateFlightMangementInput);
    return this.flightManageRepo.save(flight);
  }

  async cancel(id: string): Promise<FlightEntity> {
    const flight = await this.findOne(id);

    if (!flight) {
      throw new NotFoundException("This flight doesn't exist or departed");
    }

    await this.flightManageRepo.delete(id);
    return flight;
  }
}
