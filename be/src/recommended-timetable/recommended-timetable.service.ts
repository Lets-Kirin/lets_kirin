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

      // DB에 저장
      const recommendationEntity = this.timetableRepository.create({
        userID: user.id,
        courses: aiResponse.data.map(course => ({
          courseName: course.courseName,
          courseNumber: course.courseNumber,
          sectionNumber: course.sectionNumber,
          professorName: course.professorName,
          reasonForRecommendingClass: course.recommendDescription
        }))
      });

      await this.timetableRepository.save(recommendationEntity);

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
      // 사용자 정보 직접 조회
      const user = await this.userRepository.findOne({ 
        where: { userID: userID } 
      });

      if (!user) {
        return {
          isSuccess: false,
          code: 404,
          message: '사용자를 찾을 수 없습니다.',
          fileUpload: false,
          result: null
        };
      }
        
      // 추천 시간표 조회
      const recommendations = await this.timetableRepository.find({
        where: { userID: user.id },
        order: { id: 'ASC' }
      });

      // 추천 시간표가 없는 경우
      if (!recommendations || recommendations.length === 0) {
        return {
          isSuccess: true,
          code: 200,
          message: '추천된 시간표가 없습니다.',
          fileUpload: user.fileUpload,
          result: {
            userName: user.name,
            year: parseInt(user.year),
            semester: user.semester,
            recommendedCourses: []
          }
        };
      }

      // 추천 시간표 변환
      const recommendedCourses = await Promise.all(
        recommendations.map(async (recommendation) => {
          const coursesWithDetails = await Promise.all(
            recommendation.courses.map(async (course) => {
              const courseInfo = await this.coursesRepository.findOne({
                where: {
                  courseNumber: course.courseNumber,
                  sectionNumber: course.sectionNumber,
                  professorName: course.professorName
                }
              });

              if (!courseInfo) return null;

              // 스케줄 정보 구성
              const schedules = [];
              if (courseInfo.courseDay && courseInfo.courseTime) {
                const days = courseInfo.courseDay.replace(/[,\s]+/g, '');
                const times = courseInfo.courseTime.split(',');
                
                for (let i = 0; i < days.length; i++) {
                  schedules.push({
                    courseDay: days.charAt(i),
                    courseTime: times[0].trim(),
                    classroom: courseInfo.classroom
                  });
                }
              }

              return {
                courseName: course.courseName,
                courseNumber: course.courseNumber,
                sectionNumber: course.sectionNumber,
                professorName: course.professorName,
                classroom: courseInfo.classroom,
                schedules: schedules
              };
            })
          );

          return {
            courseID: recommendation.id,
            courses: coursesWithDetails.filter(course => course !== null)
          };
        })
      );

      return {
        isSuccess: true,
        code: 200,
        message: '시간표 조회에 성공하였습니다.',
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

  async deleteUserRecommendations(userID: string, courseId: number): Promise<ResponseDto> {
    try {
      // 사용자 확인 - userID(uuid)로 조회
      const user = await this.userRepository.findOne({
        where: { userID: userID }
      });

      if (!user) {
        return new ResponseDto(
          false,
          '사용자를 찾을 수 없습니다.',
          null,
          HttpStatus.NOT_FOUND
        );
      }

      // 특정 시간표가 해당 사용자의 것인지 확인 - user.id(로그인 ID)로 조회
      const recommendation = await this.timetableRepository.findOne({
        where: {
          id: courseId,
          userID: user.id  // RecommendedTimetable의 userID는 User의 id(로그인 ID)와 매칭
        }
      });

      if (!recommendation) {
        return new ResponseDto(
          false,
          '삭제할 시간표를 찾을 수 없거나 권한이 없습니다.',
          null,
          HttpStatus.NOT_FOUND
        );
      }

      // 해당 시간표 삭제
      const result = await this.timetableRepository.delete({
        id: courseId,
        userID: user.id  // 마찬가지로 user.id 사용
      });
      
      if (result.affected === 0) {
        return new ResponseDto(
          false,
          '시간표 삭제에 실패했습니다.',
          null,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      return new ResponseDto(
        true,
        '시간표가 성공적으로 삭제되었습니다.',
        null,
        HttpStatus.OK
      );
    } catch (error) {
      console.error('Error in deleteUserRecommendations:', error);
      throw new HttpException(
        new ResponseDto(
          false,
          '시간표 삭제 중 오류가 발생했습니다.',
          null,
          HttpStatus.INTERNAL_SERVER_ERROR
        ),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
