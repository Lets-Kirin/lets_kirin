import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Courses } from './course.entity';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Courses]), // Courses 엔티티를 TypeORM에 등록
  ],
  providers: [CourseService],
  controllers: [CourseController],
})
export class CourseModule {}
