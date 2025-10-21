import { Module } from '@nestjs/common';
import { AirLinesService } from './air_lines.service';
import { AirLinesResolver } from './air_lines.resolver';
import { AirLine } from './entities/air_line.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'users/users.module';


@Module({
  providers: [AirLinesResolver, AirLinesService],
  exports: [AirLinesService],
  imports: [TypeOrmModule.forFeature([AirLine]), UsersModule],
})
export class AirLinesModule {}
