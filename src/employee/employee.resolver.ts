import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from "@nestjs/graphql";
import { EmployeesService } from "./employee.service";
import { Employee } from "./entities/employee.entity";
import { UpdateEmployeeInput } from "./dto/update-employee.input";
import { CreateEmployeeInput } from "./dto/create-employee.input";
import { User } from "users/entities/user.entity";

import DataLoader from "dataloader";
import { InjectDataSource } from "@nestjs/typeorm";
import { userLoader } from "@core/loaders/user.loader";
import { DataSource } from "typeorm";
import { PermissionsD } from "permissions/decorators/permissions.decorator";
import { action } from "@core/enums/permissions.action";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "auth/guard/auth.guard";
import { PermissionsGuard } from "permissions/guard/permissions.guard";
import { employeeUserLoader } from "@core/loaders/user-employee.loader";

@Resolver(() => Employee)
@PermissionsD(action.super_admin, action.view_staff)
@UseGuards(AuthGuard, PermissionsGuard)
export class EmployeesResolver {
  private userLoaderInstance: DataLoader<string, User>;
  private employeeLoaderInstance: DataLoader<string, Employee>;
  constructor(
    private readonly employeesService: EmployeesService,
    @InjectDataSource() private dataSource: DataSource
  ) {
    this.userLoaderInstance = userLoader(this.dataSource);
    this.employeeLoaderInstance = employeeUserLoader(this.dataSource);
  }

  @Mutation(() => Employee, { name: "assignEmployee" })
  async assignEmployee(
    @Args("assignToFlightInput", { type: () => CreateEmployeeInput })
    assignInput: CreateEmployeeInput
  ): Promise<Employee> {
    return await this.employeesService.assignEmployee(assignInput);
  }

  @Query(() => [Employee], { name: "employees" })
  findAll() {
    return this.employeesService.findAll();
  }

  @Query(() => Employee, { name: "employee" })
  findOne(@Args("id", { type: () => String }) id: string) {
    return this.employeesService.findOne(id);
  }

  @Mutation(() => Employee)
  updateEmployee(
    @Args("updateEmployeeInput") updateEmployeeInput: UpdateEmployeeInput
  ) {
    return this.employeesService.update(updateEmployeeInput);
  }

  @Mutation(() => Employee)
  removeEmployee(@Args("id", { type: () => String }) id: string) {
    return this.employeesService.remove(id);
  }
}
