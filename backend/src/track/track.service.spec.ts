import { Test, TestingModule } from '@nestjs/testing';
import { TrackService } from './track.service';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Track } from '../entities/track.entity';
import { User } from '../entities/user.entity';
import { FileService } from '../file/file.service';

describe('TrackService', () => {
  let service: TrackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackService,
        UsersService,
        FileService,
        {
          provide: getRepositoryToken(Track),
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TrackService>(TrackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
