import { Test, TestingModule } from '@nestjs/testing';
import { ChannelusersService } from './channel-users.service';

describe('ChannelusersService', () => {
  let service: ChannelusersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelusersService],
    }).compile();

    service = module.get<ChannelusersService>(ChannelusersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
