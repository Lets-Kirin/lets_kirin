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
    return this.courseService.create(courseData);
  }

  @Get('findOne/:id')
  findOne(@Param('id') id: string): Promise<Courses> {
    return this.courseService.findOne(+id);
  }

  @Get('findAll')
  findAll(): Promise<Courses[]> {
    return this.courseService.findAll();
  }

  @Delete('remove/:id')
  remove(@Param('id') id: string): Promise<void> {
    return this.courseService.remove(+id);
  }

  @Get('timetable')
  async getTimetable() {
    return this.courseService.getTimetable();
  }

  @Get('search')
  async search(@Query('query') query: string) {
    return this.courseService.search(query);
  }
}
