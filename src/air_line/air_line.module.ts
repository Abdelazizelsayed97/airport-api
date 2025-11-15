import { Module } from "@nestjs/common";
import { AirLinesService } from "./air_line.service";
import { AirLinesResolver } from "./air_line.resolver";
import { AirLine } from "./entities/air_line.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "users/users.module";

@Module({
  providers: [AirLinesResolver, AirLinesService],
  exports: [AirLinesService],
  imports: [TypeOrmModule.forFeature([AirLine])],
})
export class AirLinesModule {}
