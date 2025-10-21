import { Test, TestingModule } from '@nestjs/testing';
import { AirLinesService } from './air_lines.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AirLine } from './entities/air_line.entity';

describe('AirLinesService', () => {
  let service: AirLinesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirLinesService,
        {
          provide: getRepositoryToken(AirLine),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AirLinesService>(AirLinesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
