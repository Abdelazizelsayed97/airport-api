import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { FlightMangementService } from './flight_mangement.service';
import { CreateFlightMangementInput } from './dto/create-flight_mangement.input';
import { UpdateFlightMangementInput } from './dto/update-flight_mangement.input';
import { FlightsFilterInput } from './dto/flight.filter.dto';
import { UseGuards } from '@nestjs/common';
import FlightEntity from './entities/flight.entity';
import { Roles } from 'auth/decorators/auth.decorator';
import { CurrentUser } from 'auth/decorators/current-user.decorator';
import { AuthGuard } from 'auth/guard/auth.guard';
import { UsersRoles } from 'enums/user.roles';
import PaginationInput from 'pagination/pagination.dto';
import { User } from 'users/entities/user.entity';
import { RolesGuard } from 'users/users.guards/role.guard';
import { sout } from 'users/users.service';

@UseGuards(AuthGuard, RolesGuard)
@Roles(UsersRoles.admin, UsersRoles.staff)
@Resolver(() => FlightEntity)
export class FlightMangementResolver {
  constructor(
    private readonly flightMangementService: FlightMangementService,
  ) {}
  @Roles(UsersRoles.admin)
  @Mutation(() => FlightEntity, { name: 'createFlight' })
  createFlight(
    @Args('createFlightMangementInput')
    createFlightMangementInput: CreateFlightMangementInput,
    @CurrentUser() user: User,
  ) {
    sout(user);
    return this.flightMangementService.create(createFlightMangementInput);
  }

  @Roles(UsersRoles.admin)
  @UseGuards(AuthGuard, RolesGuard)
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

  @Roles(UsersRoles.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => FlightEntity)
  updateFlightMangement(
    @Args('updateFlightMangementInput')
    updateFlightMangementInput: UpdateFlightMangementInput,
  ): Promise<FlightEntity> {
    return this.flightMangementService.update(
      updateFlightMangementInput.id,
      updateFlightMangementInput,
    );
  }

  @Roles(UsersRoles.admin)
  @Mutation(() => FlightEntity)
  removeFlightMangement(@Args('id', { type: () => String }) id: string) {
    return this.flightMangementService.cancel(id);
  }
}
