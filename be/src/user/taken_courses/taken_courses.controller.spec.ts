import { Test, TestingModule } from '@nestjs/testing';
import { TakenCoursesController } from './taken_courses.controller';

describe('TakenCoursesController', () => {
  let controller: TakenCoursesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TakenCoursesController],
    }).compile();

    controller = module.get<TakenCoursesController>(TakenCoursesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
