import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Courses } from './course.entity';
import { CourseSearchResponseDto } from './course.search.response.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Courses)
    private readonly courseRepository: Repository<Courses>,
  ) {}

  public async create(courseData: Partial<Courses>): Promise<Courses> {
    // const course = this.courseRepository.create(courseData);
    return this.courseRepository.save(courseData);
  }

  public async findAll(): Promise<Courses[]> {
    return this.courseRepository.find();
  }

  public async findOne(id: number): Promise<Courses> {
    return this.courseRepository.findOne({ where: { id: id } });
  }

  public async remove(id: number) {
    const course = await this.courseRepository.findOne({ where: { id } });
    await this.courseRepository.delete(course);
  }

  public async getTimetable() {
    return {
      courses: [
        {
          courseName: '컴퓨터 구조',
          courseStartTime: '10:00',
          courseEndTime: '12:00',
          courseRoom: '센B114',
          professor: '정승화',
          courseDays: ['월요일', '수요일'],
          describe:
            '컴퓨터의 하드웨어 구성 및 작동 원리를 이해하여 효율적인 시스템 설계의 기초를 다진다.',
        },
        {
          courseName: '이산수학및프로그래밍',
          courseStartTime: '10:30',
          courseEndTime: '12:00',
          courseRoom: '센B111',
          professor: '이은상',
          courseDays: ['화요일', '목요일'],
          describe:
            '알고리즘과 데이터 구조를 이해하기 위한 수학적 기초를 제공하며, 프로그래밍 문제 해결 능력을 강화한다.',
        },
        {
          courseName: '선형대수및프로그래밍',
          courseStartTime: '12:00',
          courseEndTime: '13:30',
          courseRoom: '센B114',
          professor: '이종원',
          courseDays: ['화요일', '목요일'],
          describe:
            '벡터와 행렬의 이론을 배우고 이를 활용한 프로그래밍 기술을 익혀 데이터 처리 및 분석 능력을 향상시킨다.',
        },
        {
          courseName: 'Technical Writing',
          courseStartTime: '12:00',
          courseEndTime: '14:00',
          courseRoom: '센B109',
          professor: '진실로',
          courseDays: ['월요일'],
          describe:
            '영어의 문법과 문장 구조를 이해하고, 문서 작성 및 표현 능력을 향상시킨다.',
        },
        {
          courseName: '창업과기업가정신1',
          courseStartTime: '13:30',
          courseEndTime: '15:00',
          courseRoom: '학대공연장',
          professor: '신하얀',
          courseDays: ['수요일'],
          describe:
            '창업의 기본 개념과 기업가정신을 이해하여 창의적이고 혁신적인 비즈니스 아이디어를 개발할 수 있는 기초를 마련한다.',
        },
        {
          courseName: 'SW설계기초(산학프로젝트입문)',
          courseStartTime: '15:00',
          courseEndTime: '16:30',
          courseRoom: '센B112',
          professor: '최준연',
          courseDays: ['화요일', '목요일'],
          describe:
            '소프트웨어 설계의 기본 원칙과 방법론을 배우며, 실용적인 소프트웨어 개발 능력을 기른다.',
        },
        {
          courseName: '알고리즘및실습',
          courseStartTime: '15:00',
          courseEndTime: '16:30',
          courseRoom: '센B111',
          professor: '송오영',
          courseDays: ['수요일'],
          describe:
            '다양한 알고리즘의 원리를 배우고 이를 실제 문제에 적용하여 문제 해결 능력을 강화한다.',
        },
      ],
    };
  }

  public async search(query: string): Promise<CourseSearchResponseDto[]> {
    if (!query || query.trim() === '') {
      return [];
    }

    const trimmedQuery = query.trim();

    const courses = await this.courseRepository.find({
      where: { courseName: Like(`%${trimmedQuery}%`) },
      order: { courseName: 'ASC' },
    });

    return courses.map((course) => new CourseSearchResponseDto(course));
  }
}
