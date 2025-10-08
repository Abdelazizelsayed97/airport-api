import { Test, TestingModule } from '@nestjs/testing';
import { FlightMangementService } from './flight_mangement.service';

describe('FlightMangementService', () => {
  let service: FlightMangementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlightMangementService],
    }).compile();

    service = module.get<FlightMangementService>(FlightMangementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
