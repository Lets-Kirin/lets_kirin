import { Test, TestingModule } from '@nestjs/testing';
import { TakenCoursesService } from './taken_courses.service';

describe('TakenCoursesService', () => {
  let service: TakenCoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TakenCoursesService],
    }).compile();

    service = module.get<TakenCoursesService>(TakenCoursesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
