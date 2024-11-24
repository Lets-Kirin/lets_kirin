import { Repository, DataSource } from 'typeorm';
import { RecommendedTimetable } from './recommended-timetable.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class RecommendedTimetableRepository extends Repository<RecommendedTimetable> {
  constructor(private dataSource: DataSource) {
    super(RecommendedTimetable, dataSource.createEntityManager());
  }

  async createRecommendations(
    userID: string,
    courses: any[],
  ): Promise<RecommendedTimetable[]> {
    try {
      const recommendations = courses.map((course) =>
        this.create({
          userID,
          courseName: course.courseName,
          courseNumber: course.courseNumber,
          sectionNumber: course.sectionNumber,
          professorName: course.professorName,
          reasonForRecommendingClass: course.reasonForRecommendingClass,
        }),
      );

      return await this.save(recommendations);
    } catch (error) {
      console.error('Error in createRecommendations:', error);
      throw new HttpException(
        'Failed to save recommendations',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByUserId(userID: string): Promise<RecommendedTimetable[]> {
    try {
      return await this.find({
        where: { userID },
        order: { id: 'DESC' },
      });
    } catch (error) {
      console.error('Error in findByUserId:', error);
      throw new HttpException(
        'Failed to find recommendations',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteByUserId(userID: string): Promise<void> {
    try {
      await this.delete({ userID });
    } catch (error) {
      console.error('Error in deleteByUserId:', error);
      throw new HttpException(
        'Failed to delete recommendations',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
