import { Test, TestingModule } from '@nestjs/testing';
import { RecommendedTimetableController } from './recommended-timetable.controller';

describe('RecommendedTimetableController', () => {
  let controller: RecommendedTimetableController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecommendedTimetableController],
    }).compile();

    controller = module.get<RecommendedTimetableController>(RecommendedTimetableController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
