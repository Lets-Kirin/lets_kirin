import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { RecommendedTimetableRepository } from './recommended-timetable.repository';
import { ResponseDto } from '../common/dto/response.dto';
import { TimetableResponseDto, CourseInfoDto } from './dto/timetable-response.dto';
import { User } from '../user/user.entity';
import { Courses } from '../course/course.entity';
import { Repository } from 'typeorm';
import { UserRepository } from 'src/user/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class RecommendedTimetableService {
    constructor(
        private readonly timetableRepository: RecommendedTimetableRepository,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Courses)
        private readonly coursesRepository: Repository<Courses>,
        private readonly httpService: HttpService,
        private readonly jwtService: JwtService,
    ) {}

  // POST /recommended-timetable
  async createRecommendation(requestData: any, token: string): Promise<ResponseDto> {
    try {
      // 토큰에서 userID 추출
      const decodedToken = this.jwtService.verify(token.replace('Bearer ', ''), {
        secret: process.env.JWT_SECRET
      });
      
      console.log('Decoded Token:', decodedToken.sub || decodedToken.userID); // 디버깅용 로그

      // 사용자 정보 조회
      const user = await this.userRepository.findOne({ 
        where: { id: decodedToken.id } 
      });

      if (!user) {
        throw new HttpException('사용자를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
      }

      const aiRequestData = {
        user_id: user.id,
        ...requestData,
      };
      
      console.log('AI Request Data:', JSON.stringify(aiRequestData, null, 2));
      
      // JSON 문자열로 변환하여 모든 키를 큰따옴표로 묶기
      const jsonStringData = JSON.stringify(aiRequestData, null, 2);

      console.log('AI Request Data:', jsonStringData);

      // 기존 추천 데이터 삭제
      await this.timetableRepository.deleteByUserId(user.id);

      const aiResponse = await firstValueFrom(
        this.httpService.post(
          process.env.AI_SERVICE_URL + "/course/recommend",
          jsonStringData
        )
      );


      // DB에 저장할 추천 데이터 구성
      const recommendationsForDB = aiResponse.data.result.map(course => ({
        userID: user.id,
        courseName: course.courseName,
        courseNumber: course.courseNumber,
        sectionNumber: course.sectionNumber,
        professorName: course.professorName,
        reasonForRecommendingClass: course.recommendDescription
      }));

      // DB에 저장
      await Promise.all(
        recommendationsForDB.map(recommendation => 
          this.timetableRepository.save(
            this.timetableRepository.create(recommendation)
          )
        )
      );

      // FE에 보낼 응답 데이터 구성
      const coursesWithSchedules = await Promise.all(
        aiResponse.data.result.map(async (course) => {
          const courseInfo = await this.coursesRepository.findOne({
            where: {
              courseNumber: course.courseNumber,
              sectionNumber: course.sectionNumber,
              professorName: course.professorName
            }
          });

          const schedules = [];
          if (courseInfo?.courseDay && courseInfo?.courseTime) {
            const days = courseInfo.courseDay.split(',');
            const times = courseInfo.courseTime.split(',');
            
            for (let i = 0; i < days.length; i++) {
              schedules.push({
                courseDay: days[i].trim(),
                courseTime: times[i].trim(),
                classroom: courseInfo.classroom
              });
            }
          }

          return {
            courseName: course.courseName,
            courseNumber: course.courseNumber,
            sectionNumber: course.sectionNumber,
            professorName: course.professorName,
            description: course.recommendDescription,
            schedules: schedules
          };
        })
      );

      const responseData = {
        isSuccess: true,
        code: 200,
        message: '시간표 만들기에 성공하였습니다.',
        result: {
          courses: coursesWithSchedules
        }
      };

      return new ResponseDto(
        true,
        '시간표 추천에 성공했습니다.',
        responseData,
        HttpStatus.OK
      );
    } catch (error) {
      console.error('Error in createRecommendation:', error);
      throw new HttpException(
        new ResponseDto(
          false,
          '시간표 추천 생성에 실패했습니다.',
          null,
          HttpStatus.INTERNAL_SERVER_ERROR
        ),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // GET /recommended-timetable
  async getUserRecommendations(userID: string): Promise<ResponseDto> {
    try {
      const recommendations = await this.timetableRepository.findByUserId(userID);

      // 사용자 정보 조회
      const user = await this.userRepository.findOne({ where: { userID } });
      if (!user) {
        throw new HttpException('사용자를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
      }
      
      // 추천 시간표를 ID별로 그룹화
      const groupedRecommendations = new Map<number, any[]>();
      
      for (const rec of recommendations) {
        // 강의 정보 조회
        const courseInfo = await this.coursesRepository.findOne({
          where: {
            courseNumber: rec.courseNumber,
            sectionNumber: rec.sectionNumber,
            professorName: rec.professorName
          }
        });

        if (courseInfo) {
          if (!groupedRecommendations.has(rec.id)) {
            groupedRecommendations.set(rec.id, []);
          }

          // 스케줄 정보 구성
          const schedules = [];
          if (courseInfo.courseDay && courseInfo.courseTime) {
            const days = courseInfo.courseDay.split(',');
            const times = courseInfo.courseTime.split(',');
            
            for (let i = 0; i < days.length; i++) {
              schedules.push({
                courseDay: days[i].trim(),
                courseTime: times[i].trim(),
                classroom: courseInfo.classroom
              });
            }
          }

          groupedRecommendations.get(rec.id).push({
            courseName: rec.courseName,
            courseNumber: rec.courseNumber,
            sectionNumber: rec.sectionNumber,
            professorName: rec.professorName,
            classroom: courseInfo.classroom,
            schedules: schedules
          });
        }
      }

      const responseData = {
        userName: user.name,
        fileUpload: user.fileUpload || false,
        year: user.year || null,
        semester: user.semester || null,
        recommendedCourses: Array.from(groupedRecommendations.entries()).map(([id, courses]) => ({
          courseID: id,
          courses: courses
        }))
      };

      return new ResponseDto(
        true,
        '시간표 만들기에 성공하였습니다.',
        responseData,
        HttpStatus.OK
      );
    } catch (error) {
      console.error('Error in getUserRecommendations:', error);
      throw new HttpException(
        new ResponseDto(
          false,
          '시간표 추천 조회에 실패했습니다.',
          null,
          HttpStatus.INTERNAL_SERVER_ERROR
        ),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteUserRecommendations(userID: string): Promise<ResponseDto> {
    try {
      const result = await this.timetableRepository.delete({ userID });
      
      if (result.affected === 0) {
        return new ResponseDto(
          false,
          '삭제할 시간표 추천이 없습니다.',
          '시간표 추천 없음',
          HttpStatus.NOT_FOUND
        );
      }

      return new ResponseDto(
        true,
        '시간표 추천 삭제에 성공했습니다.',
        '시간표 추천 삭제 성공',
        HttpStatus.OK
      );
    } catch (error) {
      console.error('Error in deleteUserRecommendations:', error);
      throw new HttpException(
        new ResponseDto(
          false,
          '시간표 추천 삭제 중 오류가 발생했습니다.',
          '시간표 추천 삭제 실패',
          HttpStatus.INTERNAL_SERVER_ERROR
        ),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
