import { Test, TestingModule } from '@nestjs/testing';
import { RecommendedTimetableService } from './recommended-timetable.service';

describe('RecommendedTimetableService', () => {
  let service: RecommendedTimetableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecommendedTimetableService],
    }).compile();

    service = module.get<RecommendedTimetableService>(RecommendedTimetableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
