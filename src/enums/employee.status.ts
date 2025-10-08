import { registerEnumType } from "@nestjs/graphql";

export enum EmployeeStatus {
  assigned = 'assigned',
  free = 'free',
}
registerEnumType(EmployeeStatus, {
  name: 'EmployeeStatus',
});
