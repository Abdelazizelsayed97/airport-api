import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Subscription,
} from '@nestjs/graphql';
import { FlightMangementService } from './flight_mangement.service';
import FlightMangementEntity from './entities/flight_mangement.entity';
import { CreateFlightMangementInput } from './dto/create-flight_mangement.input';
import { UpdateFlightMangementInput } from './dto/update-flight_mangement.input';
import PaginationInput from 'src/pagination/pagination.dto';
import { FlightsFilterInput } from './dto/flight.filter.dto';
import { filter } from 'rxjs';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/users/users.guards/role.guard';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Reflector } from '@nestjs/core';
import { UsersRoles } from 'src/enums/user.roles';
import { Roles } from 'src/auth/decorators/auth.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Roles(UsersRoles.admin, UsersRoles.staff)
@Resolver(() => FlightMangementEntity)
export class FlightMangementResolver {
  constructor(
    private readonly flightMangementService: FlightMangementService,
  ) {}
  @Roles(UsersRoles.admin)
  @Mutation(() => FlightMangementEntity, { name: 'createFlight' })
  createFlight(
    @Args('createFlightMangementInput')
    createFlightMangementInput: CreateFlightMangementInput,
  ) {
    return this.flightMangementService.create(createFlightMangementInput);
  }

  @Roles(UsersRoles.admin)
  @Query(() => [FlightMangementEntity], {
    name: 'getAllFlights',
    nullable: true,
  })
  findAll(
    @Args('pagination', { type: () => PaginationInput, nullable: true })
    pagination: PaginationInput,
    @Args('filter', { type: () => FlightsFilterInput, nullable: true })
    filter: FlightsFilterInput,
  ): Promise<FlightMangementEntity[]> {
    return this.flightMangementService.findAll(pagination, filter);
  }

  @Query(() => FlightMangementEntity, { name: 'flightMangementById' })
  findOne(
    @Args('id', { type: () => String }) id: string,
  ): Promise<FlightMangementEntity | null> {
    return this.flightMangementService.findOne(id);
  }

  @Roles(UsersRoles.admin)
  @Mutation(() => FlightMangementEntity)
  updateFlightMangement(
    @Args('updateFlightMangementInput')
    updateFlightMangementInput: UpdateFlightMangementInput,
  ): Promise<FlightMangementEntity> {
    return this.flightMangementService.update(
      updateFlightMangementInput.id,
      updateFlightMangementInput,
    );
  }

  @Roles(UsersRoles.admin)
  @Mutation(() => FlightMangementEntity)
  removeFlightMangement(@Args('id', { type: () => String }) id: string) {
    return this.flightMangementService.cancel(id);
  }
}
