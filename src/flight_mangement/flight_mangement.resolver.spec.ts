import { Test, TestingModule } from '@nestjs/testing';
import { FlightMangementResolver } from './flight_mangement.resolver';
import { FlightMangementService } from './flight_mangement.service';

describe('FlightMangementResolver', () => {
  let resolver: FlightMangementResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlightMangementResolver, FlightMangementService],
    }).compile();

    resolver = module.get<FlightMangementResolver>(FlightMangementResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
