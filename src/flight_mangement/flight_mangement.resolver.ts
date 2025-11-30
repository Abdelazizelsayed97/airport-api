import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from "@nestjs/graphql";
import { FlightMangementService } from "./flight_mangement.service";
import { CreateFlightMangementInput } from "./dto/create-flight_mangement.input";
import { UpdateFlightMangementInput } from "./dto/update-flight_mangement.input";
import { FlightsFilterInput } from "./dto/flight.filter.dto";
import { UseGuards } from "@nestjs/common";
import FlightEntity from "./entities/flight.entity";
import { AuthGuard } from "auth/guard/auth.guard";
import { UsersRoles } from "@core/enums/user.roles";
import PaginationInput from "pagination/pagination.dto";
import { PermissionsD } from "permissions/decorators/permissions.decorator";
import { PermissionsGuard } from "permissions/guard/permissions.guard";
import { Booking } from "../booking/entities/book.entity";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import DataLoader from "dataloader";
import { BookingsLoader } from "@core/loaders/flight-bookings.loader";

import { action } from "@core/enums/permissions.action";
import { userFlightLoader } from "@core/loaders/user-flights.loader";

@Resolver(() => FlightEntity)
export class FlightMangementResolver {
  private flightBookingsLoaderInstance: DataLoader<string, Booking[]>;
  private flightLoaderInstance: DataLoader<string, FlightEntity>;
  constructor(
    private readonly flightMangementService: FlightMangementService,

    @InjectDataSource() private dataSource: DataSource
  ) {
    this.flightBookingsLoaderInstance = BookingsLoader(this.dataSource);

  }

  @Mutation(() => FlightEntity, { name: "createFlight" })
  @PermissionsD(UsersRoles.super_admin)
  @UseGuards(AuthGuard, PermissionsGuard)
  createFlight(
    @Args("createFlightMangementInput")
    createFlightMangementInput: CreateFlightMangementInput
  ) {
    return this.flightMangementService.create(createFlightMangementInput);
  }

  // @UseGuards(AuthGuard)
  @Query(() => [FlightEntity], {
    name: "getAllFlights",
    nullable: true,
  })
  findAll(
    @Args("pagination", { type: () => PaginationInput, nullable: true })
    pagination: PaginationInput,
    @Args("filter", { type: () => FlightsFilterInput, nullable: true })
    filter: FlightsFilterInput
  ): Promise<FlightEntity[]> {
    return this.flightMangementService.findAll(pagination, filter);
  }

  @Query(() => FlightEntity, { name: "flightMangementById" })
  findOne(
    @Args("id", { type: () => String }) id: string
  ): Promise<FlightEntity | null> {
    return this.flightMangementService.findOne(id);
  }
  @PermissionsD(action.super_admin)
  @UseGuards(AuthGuard, PermissionsGuard)
  @Mutation(() => FlightEntity)
  updateFlightMangement(
    @Args("updateFlightMangementInput")
    updateFlightMangementInput: UpdateFlightMangementInput
  ): Promise<FlightEntity> {
    return this.flightMangementService.update(updateFlightMangementInput);
  }
  // @PermissionsD('admin', 'super_admin')
  @Mutation(() => FlightEntity)
  removeFlightMangement(@Args("id", { type: () => String }) id: string) {
    return this.flightMangementService.cancel(id);
  }

  @ResolveField(() => [Booking], { nullable: true })
  async bookings(@Parent() flight: FlightEntity): Promise<Booking[]> {
    const ids = flight.id;

    return await this.flightBookingsLoaderInstance.load(ids);
  }
  @ResolveField(() => FlightEntity, { nullable: true })
  async assigned(@Parent() flight: FlightEntity): Promise<FlightEntity | null> {

    if (!flight.assigned || !flight.assigned.id) {
      return null;
    }
    return await this.flightLoaderInstance.load(flight.assigned.id);
  }
}
