import { registerEnumType } from "@nestjs/graphql";

export enum flight_status {
  delayed = 'delayed',
  on_time = 'on_time',
  canceled = 'canceled',
}


registerEnumType(flight_status, {
  name: 'flight_status',
  description: 'The status of the flight',
});