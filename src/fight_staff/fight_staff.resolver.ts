import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FightStaffService } from './fight_staff.service';
import { FlightStaff } from './entities/fight_staff.entity';
import { CreateFightStaffInput } from './dto/create-fight_staff.input';
import { UpdateFightStaffInput } from './dto/update-fight_staff.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/users/users.guards/role.guard';
import { Roles } from 'src/auth/decorators/auth.decorator';
import { UsersRoles } from 'src/enums/user.roles';

@UseGuards(AuthGuard, RolesGuard)
@Roles(UsersRoles.admin, UsersRoles.staff)
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
