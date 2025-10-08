import { Injectable } from '@nestjs/common';
import { CreateFlightMangementInput } from './dto/create-flight_mangement.input';
import { UpdateFlightMangementInput } from './dto/update-flight_mangement.input';
import { Repository } from 'typeorm';
import FlightMangementEntity from './entities/flight_mangement.entity';
import { InjectRepository } from '@nestjs/typeorm';
import PaginationInput from 'src/pagination/pagination.dto';
import { FlightsFilterInput } from './dto/flight.filter.dto';

@Injectable()
export class FlightMangementService {
  constructor(
    @InjectRepository(FlightMangementEntity)
    private flightManageRepo: Repository<FlightMangementEntity>,
  ) {}
  async create(
    input: CreateFlightMangementInput,
  ): Promise<FlightMangementEntity> {
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
  ): Promise<FlightMangementEntity[]> {
    // Filter out undefined/null filter values and ensure types match entity
    const where: Partial<FlightMangementEntity> = {};
    Object.entries(filter || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Convert String objects to string primitives if needed
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
    });

    if (!flights || flights.length === 0) {
      throw new Error("This flight doesn't exist or departed");
    }
    return flights;
  }

  async findOne(id: number): Promise<FlightMangementEntity | null> {
    const flight = await this.flightManageRepo.findOne({ where: { id } });
    if (!flight) {
      throw new Error("This flight doesn't exist or departed");
    }
    return flight;
  }

  async update(
    id: number,
    updateFlightMangementInput: UpdateFlightMangementInput,
  ): Promise<FlightMangementEntity> {
    if (!id) {
      throw new Error("Id can't be null");
    }
    const flight = await this.flightManageRepo.findOne({ where: { id } });
    if (!flight) {
      throw new Error("This flight doesn't exist or departed");
    }
    Object.assign(flight, updateFlightMangementInput);
    return this.flightManageRepo.save(flight);
  }

  async cancel(id: number): Promise<FlightMangementEntity | null> {
    const flight = await this.flightManageRepo.findOne({ where: { id } });

    if (!flight) return null;
    await this.flightManageRepo.delete(id);
    return flight;
  }
}
