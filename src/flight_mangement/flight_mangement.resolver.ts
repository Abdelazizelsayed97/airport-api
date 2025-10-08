import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FlightMangementService } from './flight_mangement.service';
import FlightMangementEntity from './entities/flight_mangement.entity';
import { CreateFlightMangementInput } from './dto/create-flight_mangement.input';
import { UpdateFlightMangementInput } from './dto/update-flight_mangement.input';
import PaginationInput from 'src/pagination/pagination.dto';
import { FlightsFilterInput } from './dto/flight.filter.dto';
import { filter } from 'rxjs';

@Resolver(() => FlightMangementEntity)
export class FlightMangementResolver {
  constructor(
    private readonly flightMangementService: FlightMangementService,
  ) {}

  @Mutation(() => FlightMangementEntity, { name: 'createFlight' })
  createFlight(
    @Args('createFlightMangementInput')
    createFlightMangementInput: CreateFlightMangementInput,
  ) {
    return this.flightMangementService.create(createFlightMangementInput);
  }

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
    @Args('id', { type: () => Int }) id: number,
  ): Promise<FlightMangementEntity | null> {
    return this.flightMangementService.findOne(id);
  }

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

  @Mutation(() => FlightMangementEntity)
  removeFlightMangement(@Args('id', { type: () => Int }) id: number) {
    return this.flightMangementService.cancel(id);
  }
}
