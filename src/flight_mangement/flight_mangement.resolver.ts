import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { FlightMangementService } from './flight_mangement.service';
import { CreateFlightMangementInput } from './dto/create-flight_mangement.input';
import { UpdateFlightMangementInput } from './dto/update-flight_mangement.input';
import { FlightsFilterInput } from './dto/flight.filter.dto';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import FlightEntity from './entities/flight.entity';
import { CurrentUser } from 'auth/decorators/current-user.decorator';
import { AuthGuard } from 'auth/guard/auth.guard';
import { UsersRoles } from '@core/enums/user.roles';
import PaginationInput from 'pagination/pagination.dto';
import { User } from 'users/entities/user.entity';
import { PermissionsD } from 'permissions/decorators/permissions.decorator';
import { PermissionsGuard } from 'permissions/guard/permissions.guard';
import { action } from '@core/enums/permissions.action';

// @PermissionsD(UsersRoles.admin, UsersRoles.super_admin)
// @UseGuards(AuthGuard, PermissionsGuard)

@Resolver(() => FlightEntity)
export class FlightMangementResolver {
  constructor(
    private readonly flightMangementService: FlightMangementService,
  ) {}

  @Mutation(() => FlightEntity, { name: 'createFlight' })
  @PermissionsD(UsersRoles.super_admin)
  @UseGuards(AuthGuard, PermissionsGuard)
  createFlight(
    @Args('createFlightMangementInput')
    createFlightMangementInput: CreateFlightMangementInput,
    @CurrentUser() user: User,
  ) {
    return this.flightMangementService.create(createFlightMangementInput);
  }

  // @UseGuards(AuthGuard)
  @Query(() => [FlightEntity], {
    name: 'getAllFlights',
    nullable: true,
  })
  findAll(
    @Args('pagination', { type: () => PaginationInput, nullable: true })
    pagination: PaginationInput,
    @Args('filter', { type: () => FlightsFilterInput, nullable: true })
    filter: FlightsFilterInput,
  ): Promise<FlightEntity[]> {
    return this.flightMangementService.findAll(pagination, filter);
  }

  @Query(() => FlightEntity, { name: 'flightMangementById' })
  findOne(
    @Args('id', { type: () => String }) id: string,
  ): Promise<FlightEntity | null> {
    return this.flightMangementService.findOne(id);
  }
  // @PermissionsD('admin', 'super_admin')
  // @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => FlightEntity)
  updateFlightMangement(
    @Args('updateFlightMangementInput')
    updateFlightMangementInput: UpdateFlightMangementInput,
  ): Promise<FlightEntity> {
    return this.flightMangementService.update(updateFlightMangementInput);
  }
  // @PermissionsD('admin', 'super_admin')
  @Mutation(() => FlightEntity)
  removeFlightMangement(@Args('id', { type: () => String }) id: string) {
    return this.flightMangementService.cancel(id);
  }
}
