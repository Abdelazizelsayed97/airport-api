import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AirLinesService } from './air_line.service';
import { AirLine } from './entities/air_line.entity';
import { CreateAirLineInput } from './dto/create-air_line.input';
import { UpdateAirLineInput } from './dto/update-air_line.input';
import PaginationInput from '../pagination/pagination.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Roles } from '../auth/decorators/auth.decorator';
import { RolesGuard } from '../users/users.guards/role.guard';
import { UsersRoles } from '../core/enums/user.roles';
@Roles('admin')
@UseGuards(AuthGuard, RolesGuard)
@Resolver(() => AirLine)
export class AirLinesResolver {
  constructor(private readonly airLinesService: AirLinesService) {}

  @Mutation(() => AirLine)
  createAirLine(
    @Args('createAirLineInput') createAirLineInput: CreateAirLineInput,
  ) {
    return this.airLinesService.create(createAirLineInput);
  }

  @Query(() => [AirLine], { name: 'airLines' })
  airLines(
    @Args('paginationInput', { type: () => PaginationInput })
    paginationInput: PaginationInput,
  ) {
    return this.airLinesService.findAll(paginationInput);
  }

  @Query(() => AirLine, { name: 'airLine' })
  airline(@Args('id', { type: () => String }) id: string) {
    return this.airLinesService.findOne(id);
  }
  ap;
  @Mutation(() => AirLine)
  updateAirLine(
    @Args('updateAirLineInput') updateAirLineInput: UpdateAirLineInput,
  ) {
    return this.airLinesService.update(
      updateAirLineInput.id,
      updateAirLineInput,
    );
  }

  @Mutation(() => AirLine)
  removeAirLine(@Args('id', { type: () => String }) id: string) {
    return this.airLinesService.remove(id);
  }
}
