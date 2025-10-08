import { Test, TestingModule } from '@nestjs/testing';
import { AuthServices } from './users.service';

describe('UsersService', () => {
  let service: AuthServices;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthServices],
    }).compile();

    service = module.get<AuthServices>(AuthServices);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
