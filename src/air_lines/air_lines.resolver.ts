import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AirLinesService } from './air_lines.service';
import { AirLine } from './entities/air_line.entity';
import { CreateAirLineInput } from './dto/create-air_line.input';
import { UpdateAirLineInput } from './dto/update-air_line.input';

@Resolver(() => AirLine)
export class AirLinesResolver {
  constructor(private readonly airLinesService: AirLinesService) {}

  @Mutation(() => AirLine)
  createAirLine(@Args('createAirLineInput') createAirLineInput: CreateAirLineInput) {
    return this.airLinesService.create(createAirLineInput);
  }

  @Query(() => [AirLine], { name: 'airLines' })
  findAll() {
    return this.airLinesService.findAll();
  }

  @Query(() => AirLine, { name: 'airLine' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.airLinesService.findOne(id);
  }

  @Mutation(() => AirLine)
  updateAirLine(@Args('updateAirLineInput') updateAirLineInput: UpdateAirLineInput) {
    return this.airLinesService.update(updateAirLineInput.id, updateAirLineInput);
  }

  @Mutation(() => AirLine)
  removeAirLine(@Args('id', { type: () => Int }) id: number) {
    return this.airLinesService.remove(id);
  }
}
