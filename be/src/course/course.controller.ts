import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { Courses } from './course.entity';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post('upload')
  create(@Body() courseData: Partial<Courses>): Promise<Courses> {
    return this.courseService.createCourse(courseData);
  }

  @Get('findOne/:id')
  findOne(@Param('id') id: string): Promise<Courses> {
    return this.courseService.findCourseById(+id);
  }

  @Get('findAll')
  findAll(): Promise<Courses[]> {
    return this.courseService.findAllCourses();
  }

  @Delete('remove/:id')
  remove(@Param('id') id: string): Promise<void> {
    return this.courseService.removeCourse(+id);
  }

  @Get('timetable')
  async getTimeTable() {
    return this.courseService.getTimeTable();
  }

  @Get('search')
  async search(@Query('query') query: string) {
    return this.courseService.searchCourses(query);
  }
}
