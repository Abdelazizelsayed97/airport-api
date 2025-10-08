import { Test, TestingModule } from '@nestjs/testing';
import { FightStaffResolver } from './fight_staff.resolver';
import { FightStaffService } from './fight_staff.service';

describe('FightStaffResolver', () => {
  let resolver: FightStaffResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FightStaffResolver, FightStaffService],
    }).compile();

    resolver = module.get<FightStaffResolver>(FightStaffResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
