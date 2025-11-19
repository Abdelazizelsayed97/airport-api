import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from "@nestjs/graphql";
import { EmployeesService } from "./employee.service";
import { Employee } from "./entities/employee.entity";

import { UpdateEmployeeInput } from "./dto/update-employee.input";
import { CreateEmployeeInput } from "./dto/create-employee.input";
import { Booking } from "booking/entities/book.entity";
import { User } from "users/entities/user.entity";
import { sout } from "users/users.service";
import DataLoader from "dataloader";
import { InjectDataSource } from "@nestjs/typeorm";
import { userLoader } from "@core/loaders/user.loader";
import { DataSource } from "typeorm";

@Resolver(() => Employee)
export class EmployeesResolver {
  private userLoaderInstance: DataLoader<string, User>;
  constructor(
    private readonly employeesService: EmployeesService,
    @InjectDataSource() private dataSource: DataSource
  ) {
    this.userLoaderInstance = userLoader(this.dataSource);
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
  @ResolveField(() => User)
  async user(@Parent() Employee: Employee): Promise<User> {
    sout("book: " + JSON.stringify(Employee.user));
    if (!Employee.user || !Employee.user.id) {
      throw new Error(`Book ${Employee.id} has no associated user`);
    }

    return await this.userLoaderInstance.load(Employee.user.id);
  }
}
