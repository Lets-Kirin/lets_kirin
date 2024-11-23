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
      
      console.log('AI Request Data:', aiRequestData);
      
      // 기존 추천 데이터 삭제
      await this.timetableRepository.deleteByUserId(user.id);

      const aiResponse = await firstValueFrom(
        this.httpService.post(
          process.env.AI_SERVICE_URL + "/course/recommend",
          aiRequestData,
          {
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 30000 // 30초 타임아웃 설정
          }
        )
      );

      // AI 응답 데이터 로깅
      console.log('AI Response Data:', JSON.stringify(aiResponse.data, null, 2));

      // 응답이 배열인지 확인
      if (!Array.isArray(aiResponse.data)) {
        throw new Error('AI 서비스 응답이 배열 형식이 아닙니다.');
      }

      if (aiResponse.data.length === 0) {
        throw new Error('AI 서비스가 추천 과목을 찾지 못했습니다.');
      }

      // DB에 저장할 추천 데이터 구성
      const recommendationsForDB = aiResponse.data.map(course => {
        console.log('Processing course:', course);
        return {
          userID: user.id,
          courseName: course.courseName,
          courseNumber: course.courseNumber,
          sectionNumber: course.sectionNumber,
          professorName: course.professorName,
          reasonForRecommendingClass: course.recommendDescription
        };
      });

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
        aiResponse.data.map(async (course) => {
          const courseInfo = await this.coursesRepository.findOne({
            where: {
              courseNumber: course.courseNumber,
              sectionNumber: course.sectionNumber,
              professorName: course.professorName
            }
          });

          const schedules = [];
          if (courseInfo?.courseDay && courseInfo?.courseTime) {
            const combinedDays = courseInfo.courseDay.replace(/[,\s]+/g, ''); // "월수" 형태의 문자열
            const times = courseInfo.courseTime.split(',');
            
            for (let i = 0; i < combinedDays.length; i++) {
              const singleDay = combinedDays.charAt(i); // 한 글자씩 분리 ("월", "수" 등)
              schedules.push({
                courseDay: singleDay,
                courseTime: times[0].trim(), // 같은 시간대 사용
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
      console.error('AI Service Error Details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: process.env.AI_SERVICE_URL + "/course/recommend",
        requestData: requestData
      });

      throw new HttpException(
        `AI 서비스 연결에 실패했습니다: ${error.message}`,
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }

  // GET /recommended-timetable
  async getUserRecommendations(userID: string): Promise<any> {
    try {
      console.log(userID);
      const recommendations = await this.timetableRepository.findByUserId(userID);
      console.log(recommendations);
        
      if (!recommendations || recommendations.length === 0) {
        return {
          isSuccess: false,
          code: 404,
          message: '추천된 시간표가 없습니다.',
          fileUpload: false,
          result: null
        };
      }

      // 사용자 정보 조회
      const user = await this.userRepository.findOne({
        where: { id: userID }
      });

      if (!user) {
        throw new HttpException('사용자를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
      }

      // 추 번째 과목의 정보로 학기 정보 가져오기
      const firstCourseInfo = await this.coursesRepository.findOne({
        where: {
          courseNumber: recommendations[0].courseNumber,
          sectionNumber: recommendations[0].sectionNumber
        }
      });

      // 추천된 과목들의 상세 정보 조회
      const recommendedCourses = await Promise.all(
        recommendations.map(async (_, index) => {
          const coursesForThisRecommendation = await Promise.all(
            recommendations.map(async (rec) => {
              const courseInfo = await this.coursesRepository.findOne({
                where: {
                  courseNumber: rec.courseNumber,
                  sectionNumber: rec.sectionNumber,
                  professorName: rec.professorName
                }
              });

              if (!courseInfo) {
                return null;
              }

              // 스케줄 정보 구성
              const schedules = [];
              if (courseInfo.courseDay && courseInfo.courseTime) {
                const combinedDays = courseInfo.courseDay.replace(/[,\s]+/g, '');
                const times = courseInfo.courseTime.split(',');
                
                for (let i = 0; i < combinedDays.length; i++) {
                  const singleDay = combinedDays.charAt(i);
                  schedules.push({
                    courseDay: singleDay,
                    courseTime: times[0].trim(),
                    classroom: courseInfo.classroom
                  });
                }
              }

              return {
                courseName: rec.courseName,
                courseNumber: rec.courseNumber,
                sectionNumber: rec.sectionNumber,
                professorName: rec.professorName,
                classroom: courseInfo.classroom,
                schedules: schedules
              };
            })
          );

          return {
            courseID: index + 1,
            courses: coursesForThisRecommendation.filter(course => course !== null)
          };
        })
      );

      return {
        isSuccess: true,
        code: 200,
        message: '시간표 만들기에 성공하였습니다.',
        fileUpload: user.fileUpload,
        result: {
          userName: user.name,
          year: parseInt(user.year),
          semester: user.semester,
          recommendedCourses: recommendedCourses
        }
      };

    } catch (error) {
      console.error('Error in getUserRecommendations:', error);
      return {
        isSuccess: false,
        code: 500,
        message: '시간표 추천 조회에 실패했습니다.',
        fileUpload: false,
        result: null
      };
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
