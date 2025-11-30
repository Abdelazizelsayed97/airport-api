import DataLoader from "dataloader";
import { Employee } from "employee/entities/employee.entity";
import { DataSource } from "typeorm";

export const employeeUserLoader = (dataoSource: DataSource) => {
  return new DataLoader<string, Employee>(async (ids: readonly string[]) => {
    const employees = await dataoSource
      .getRepository(Employee)
      .createQueryBuilder("employee")
      .where("employee.id IN (:...ids)", { ids })
      .leftJoinAndSelect("employee.user", "user")

      .getMany();

    const employeeMap = new Map(
      employees.map((employee) => [employee.id, employee])
    );
    return ids.map(
      (id) => employeeMap.get(id) || new Error(`Employee not found: ${id}`)
    );
  });
};
