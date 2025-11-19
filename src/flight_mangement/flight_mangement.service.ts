import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateFlightMangementInput } from "./dto/create-flight_mangement.input";
import { UpdateFlightMangementInput } from "./dto/update-flight_mangement.input";
import { Repository } from "typeorm";
import { FlightsFilterInput } from "./dto/flight.filter.dto";
import FlightEntity from "./entities/flight.entity";
import { pubSub } from "./subscriptions/flight.subscription.resolver";
import PaginationInput from "../pagination/pagination.dto";

import { InjectRepository } from "@nestjs/typeorm";
import { sout } from "users/users.service";

import DataLoader from "dataloader";
import { EmailService } from "email/email.service";

@Injectable()
export class FlightMangementService {
  constructor(
    @InjectRepository(FlightEntity)
    private flightManageRepo: Repository<FlightEntity>,
    // private readonly dataLoaderService: DataLoaderService
    private readonly emailService: EmailService
  ) {}
  async create(input: CreateFlightMangementInput): Promise<FlightEntity> {
    if (!input) {
      throw new Error("Bad input");
    }
    const existing = await this.flightManageRepo.findOne({
      where: { flight_number: input.flight_number },
      loadRelationIds: true,
    });
    console.log("ttttttttt --- ttttttt" + existing?.airline);
    if (existing) {
      throw new Error("There is an existing flight");
    }
    const newFlight = this.flightManageRepo.create({
      ...input,
    });
    await this.flightManageRepo.save(newFlight);
    pubSub.publish("commentAdded", { flight: newFlight });
    return newFlight;
  }

  async findAll(
    pagination: PaginationInput,
    filter: FlightsFilterInput
  ): Promise<FlightEntity[]> {
    const flights = await this.flightManageRepo.find({
      // relations: ["assigned", "bookings"],  
    });
    return flights;
  }

  async findOne(id: string): Promise<FlightEntity> {
    const flight = await this.flightManageRepo.findOne({
      where: { id },
      relations: ["assigned"],
    });
    if (!flight) {
      throw new Error("This flight doesn't exist or departed");
    }
    return flight;
  }

  async update(input: UpdateFlightMangementInput): Promise<FlightEntity> {
    if (!input.id) {
      throw new Error("Id can't be null");
    }
    const flight = await this.findOne(input.id);
    if (!flight) {
      throw new Error("This flight doesn't exist or departed");
    }

    Object.assign(flight, input);

    await this.flightManageRepo.save(flight);
    sout("Publishing flight update for flight id: " + flight.flight_status);
    await pubSub.publish("flightStatus", {
      flightStatus: flight,
    });
    const flightPassanger = await this.findOne(flight.id);
    if (flightPassanger.bookings?.length !== 0) {
      for (const book of flightPassanger.bookings!) {
        await this.emailService.sendStatusNotification(
          book.user,
          "Flight",
          book.flight?.flight_status?.toString()!
        );
      }
    }

    return flight;
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
