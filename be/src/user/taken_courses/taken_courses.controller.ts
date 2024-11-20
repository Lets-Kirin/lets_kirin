import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TakenCoursesService } from './taken_courses.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../auth/get-user.decorator';
import { User } from '../../user/user.entity';
import { memoryStorage } from 'multer';

@Controller('taken-course')
@UseGuards(AuthGuard())
export class TakenCoursesController {
  constructor(private takenCourseService: TakenCoursesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(xlsx|xls)$/)) {
          return callback(new Error('Only excel files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadExcel(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.takenCourseService.uploadExcel(file, user.id);
  }

  @Get()
  async getTakenCourses(@GetUser() user: User) {
    return this.takenCourseService.getTakenCourses(user.id);
  }
}
