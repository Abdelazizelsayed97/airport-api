import { Test, TestingModule } from '@nestjs/testing';
import { AirLinesResolver } from './air_lines.resolver';
import { AirLinesService } from './air_lines.service';

describe('AirLinesResolver', () => {
  let resolver: AirLinesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AirLinesResolver, AirLinesService],
    }).compile();

    resolver = module.get<AirLinesResolver>(AirLinesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
