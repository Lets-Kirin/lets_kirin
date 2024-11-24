import { JwtService } from '@auth/jwt.service';
import { ResponseDto } from '@common/dto/response.dto';
import { ResponseTemplate } from '@common/dto/response.template';
import { Courses } from '@course/course.entity';
import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecommendedTimetableRepository } from '@recommended-timetable/recommended-timetable.repository';
import { User } from '@user/user.entity';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

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

  async createRecommendation(
    requestData: any,
    token: string,
  ): Promise<ResponseDto> {
    try {
      const decodedToken = await this.jwtService.verifyToken(token);

      const user = await this.userRepository.findOne({
        where: { userID: decodedToken.userID },
      });

      if (!user) {
        return ResponseTemplate.USER_NOT_FOUND();
      }

      const aiRequestData = {
        user_id: user.id,
        ...requestData,
      };

      let aiResponse;
      let retryCount = 0;
      const maxRetries = 3;
      const retryDelay = 1000; // 1초 대기

      while (retryCount < maxRetries) {
        try {
          aiResponse = await firstValueFrom(
            this.httpService.post(
              process.env.AI_SERVICE_URL + '/course/recommend',
              aiRequestData,
              {
                headers: {
                  'Content-Type': 'application/json',
                },
                timeout: 30000, // 30초 타임아웃 설정
              },
            ),
          );
          break; // 성공하면 반복 중단
        } catch (error) {
          retryCount++;
          console.log(
            `AI 서비스 호출 실패 (${retryCount}/${maxRetries}):`,
            error.message,
          );

          if (retryCount === maxRetries) {
            throw new Error(`AI 서비스 연결 실패 (${maxRetries}회 시도)`);
          }

          // 다음 시도 전 대기
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }

      // 응답이 배열인지 확인
      if (!Array.isArray(aiResponse.data)) {
        throw new Error('AI 서비스 응답이 배열 형식이 아닙니다.');
      }

      if (aiResponse.data.length === 0) {
        throw new Error('AI 서비스가 추천 과목을 찾지 못했습니다.');
      }

      // DB에 저장 전 로그 추가
      console.log('User Info:', {
        id: user.id,
        userID: user.userID,
        name: user.name,
      });

      // DB에 저장
      const recommendationEntity = this.timetableRepository.create({
        userID: user.id,
        courses: aiResponse.data.map((course) => ({
          courseName: course.courseName,
          courseNumber: course.courseNumber,
          sectionNumber: parseInt(course.sectionNumber),
          professorName: course.professorName,
          reasonForRecommendingClass: course.recommendDescription,
        })),
      });

      console.log('Created Entity:', recommendationEntity); // 생성된 엔티티 로그

      const savedRecommendation =
        await this.timetableRepository.save(recommendationEntity);

      // FE에 보낼 응답 데이터 구성
      const coursesWithSchedules = await Promise.all(
        aiResponse.data.map(async (course) => {
          const courseInfo = await this.coursesRepository.findOne({
            where: {
              courseNumber: course.courseNumber,
              sectionNumber: course.sectionNumber,
              professorName: course.professorName,
            },
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
                classroom: courseInfo.classroom,
              });
            }
          }

          return {
            courseName: course.courseName,
            courseNumber: course.courseNumber,
            sectionNumber: course.sectionNumber,
            professorName: course.professorName,
            description: course.recommendDescription,
            schedules: schedules,
          };
        }),
      );

      return new ResponseDto(
        true,
        '시간표 추천에 성공했습니다.',
        {
          courseID: savedRecommendation.id,
          courses: coursesWithSchedules,
        },
        HttpStatus.OK,
      );

    } catch (error) {
      console.error('AI Service Error Details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: process.env.AI_SERVICE_URL + '/course/recommend',
        requestData: requestData,
      });

      throw new HttpException(
        `AI 서비스 연결에 실패했습니다: ${error.message}`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  // GET /recommended-timetable
  async getUserRecommendations(userID: string): Promise<ResponseDto> {
    try {
      console.log('Received userID:', userID);

      // 사용자 정보 조회
      const user = await this.userRepository.findOne({
        where: { userID: userID },
      });

      if (!user) {
        return ResponseTemplate.USER_NOT_FOUND();
      }

      console.log('Found user:', user);

      // 추천 시간표 조회 - userID(UUID) 사용
      const recommendations = await this.timetableRepository.find({
        where: { userID: user.userID }, // user.userID(UUID)를 사용
        order: { id: 'ASC' },
      });

      console.log('Found recommendations:', recommendations);

      // 추천 시간표가 없는 경우
      if (!recommendations || recommendations.length === 0) {
        return ResponseTemplate.NO_RECOMMENDED_TIMETABLE();
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
                  professorName: course.professorName,
                },
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
                    classroom: courseInfo.classroom,
                  });
                }
              }

              return {
                courseName: course.courseName,
                courseNumber: course.courseNumber,
                sectionNumber: course.sectionNumber,
                professorName: course.professorName,
                classroom: courseInfo.classroom,
                schedules: schedules,
              };
            }),
          );

          return {
            courseID: recommendation.id,
            courses: coursesWithDetails.filter((course) => course !== null),
          };
        }),
      );

      return new ResponseDto(
        true,
        '시간표 조회에 성공하였습니다.',
        {
          fileUpload: user.fileUpload,
          userName: user.name,
          year: parseInt(user.year),
          semester: user.semester,
          recommendedCourses: recommendedCourses,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      console.error('Error in getUserRecommendations:', error);
      return new ResponseDto(
        false,
        '시간표 추천 조회에 실패했습니다.',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUserRecommendations(
    token: string,
    courseId: number,
  ): Promise<ResponseDto> {
    try {
      const decodedToken = await this.jwtService.decodeToken(
        token.replace('Bearer ', ''),
      );  


      // 사용자 확인 - userID(uuid)로 조회
      const user = await this.userRepository.findOne({
        where: { userID: decodedToken.userID },
      });

      if (!user) {
        return ResponseTemplate.USER_NOT_FOUND();
      }

      // 특정 시간표가 해당 사용자의 것인지 확인 - user.id(로그인 ID)로 조회
      const recommendation = await this.timetableRepository.findOne({
        where: {
          id: courseId,
          userID: user.userID,
        },
      });

      if (!recommendation) {
        return ResponseTemplate.NO_RECOMMENDED_TIMETABLE();
      }

      const result = await this.timetableRepository.delete({
        id: courseId,
        userID: user.userID,
      });

      if (result.affected === 0) {
        return ResponseTemplate.DELETE_RECOMMENDED_TIMETABLE_ERROR();
      }

      return ResponseTemplate.DELETE_RECOMMENDED_TIMETABLE_SUCCESS();
    } catch (error) {
      return ResponseTemplate.DELETE_RECOMMENDED_TIMETABLE_ERROR();
    }
  }
}
