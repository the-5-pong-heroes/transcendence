import { Test, TestingModule } from '@nestjs/testing';
import { ChanneluserService } from './channel-users.service';

describe('ChanneluserService', () => {
  let service: ChanneluserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChanneluserService],
    }).compile();

    service = module.get<ChanneluserService>(ChanneluserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
