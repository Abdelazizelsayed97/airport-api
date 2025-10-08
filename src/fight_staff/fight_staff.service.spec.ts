import { Test, TestingModule } from '@nestjs/testing';
import { FightStaffService } from './fight_staff.service';

describe('FightStaffService', () => {
  let service: FightStaffService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FightStaffService],
    }).compile();

    service = module.get<FightStaffService>(FightStaffService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
