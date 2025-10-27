import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EmployeesService } from './employee.service';
import { Employee } from './entities/employee.entity';

import { UpdateEmployeeInput } from './dto/update-employee.input';
import { AssignToFlightDto } from './dto/assign-to-flight.dto';

@Resolver(() => Employee)
export class EmployeesResolver {
  constructor(private readonly employeesService: EmployeesService) {}

  @Mutation(() => Employee)
  async assignEmployee(
    @Args('assignToFlightInput', { type: () => AssignToFlightDto })
    assignInput: AssignToFlightDto,
  ) {
    return await this.employeesService.assignEmployee(assignInput);
  }

  @Query(() => [Employee], { name: 'employees' })
  findAll() {
    return this.employeesService.findAll();
  }

  @Query(() => Employee, { name: 'employee' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.employeesService.findOne(id);
  }

  @Mutation(() => Employee)
  updateEmployee(
    @Args('updateEmployeeInput') updateEmployeeInput: UpdateEmployeeInput,
  ) {
    return this.employeesService.update(updateEmployeeInput);
  }

  @Mutation(() => Employee)
  removeEmployee(@Args('id', { type: () => String }) id: string) {
    return this.employeesService.remove(id);
  }
}
