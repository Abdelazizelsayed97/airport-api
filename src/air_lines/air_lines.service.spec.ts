import { Test, TestingModule } from '@nestjs/testing';
import { AirLinesService } from './air_lines.service';

describe('AirLinesService', () => {
  let service: AirLinesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AirLinesService],
    }).compile();

    service = module.get<AirLinesService>(AirLinesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
