import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { RecommendedTimetableController } from './recommended-timetable.controller';
import { RecommendedTimetableService } from './recommended-timetable.service';
import { RecommendedTimetableRepository } from './recommended-timetable.repository';
import { User } from 'src/user/user.entity';
import { Courses } from 'src/course/course.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecommendedTimetableRepository, User, Courses]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [RecommendedTimetableController],
  providers: [RecommendedTimetableService, RecommendedTimetableRepository],
})
export class RecommendedTimetableModule {}
