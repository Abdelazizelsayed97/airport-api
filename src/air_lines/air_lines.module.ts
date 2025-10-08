import { Module } from '@nestjs/common';
import { AirLinesService } from './air_lines.service';
import { AirLinesResolver } from './air_lines.resolver';

@Module({
  providers: [AirLinesResolver, AirLinesService],
  exports: [AirLinesService],
})
export class AirLinesModule {}
