import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FightStaffService } from './fight_staff.service';
import { FlightStaff } from './entities/fight_staff.entity';
import { CreateFightStaffInput } from './dto/create-fight_staff.input';
import { UpdateFightStaffInput } from './dto/update-fight_staff.input';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'auth/decorators/auth.decorator';
import { AuthGuard } from 'auth/guard/auth.guard';
import { UsersRoles } from '@core/enums/user.roles';
import { RolesGuard } from 'users/users.guards/role.guard';

// @UseGuards(AuthGuard, RolesGuard)
// @Roles(UsersRoles.admin, UsersRoles.staff)
@Resolver(() => FlightStaff)
export class FightStaffResolver {
  constructor(private readonly fightStaffService: FightStaffService) {}

  @Mutation(() => FlightStaff)
  createFightStaff(
    @Args('createFightStaffInput') createFightStaffInput: CreateFightStaffInput,
  ) {
    return this.fightStaffService.assignMember(createFightStaffInput);
  }

  @Query(() => [FlightStaff], { name: 'fightStaff' })
  findAll() {
    return this.fightStaffService.findAll();
  }

  @Query(() => FlightStaff, { name: 'fightStaff' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.fightStaffService.findOne(id);
  }

  @Mutation(() => FlightStaff)
  updateFightStaff(
    @Args('updateFightStaffInput') updateFightStaffInput: UpdateFightStaffInput,
  ) {
    return this.fightStaffService.update(
      updateFightStaffInput.id,
      updateFightStaffInput,
    );
  }

  @Mutation(() => FlightStaff)
  removeFightStaff(@Args('id', { type: () => Int }) id: number) {
    return this.fightStaffService.remove(id);
  }
}
