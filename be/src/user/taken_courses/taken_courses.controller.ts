import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TakenCoursesService } from './taken_courses.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../auth/get-user.decorator';
import { User } from '../../user/user.entity';

@Controller('taken-course')
@UseGuards(AuthGuard())
export class TakenCoursesController {
  constructor(private takenCourseService: TakenCoursesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    return this.takenCourseService.uploadExcel(file, user.id);
  }

  @Get()
  async getTakenCourses(@GetUser() user: User) {
    return this.takenCourseService.getTakenCourses(user.id);
  }
}
