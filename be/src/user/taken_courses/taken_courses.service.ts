import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TakenCourses } from './taken_courses.entity';
import { Repository } from 'typeorm';
import { COURSE_SKILL_MAPPING } from './taken_courses_skill';
import * as XLSX from 'xlsx';
import { UserRepository } from '../user.repository';

@Injectable()
export class TakenCoursesService {
  constructor(
    @InjectRepository(TakenCourses)
    private takenCoursesRepository: Repository<TakenCourses>,
    private userRepository: UserRepository,
  ) {}

  private async updateUserSkills(
    userId: string,
    courseName: string,
  ): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        console.log(`User not found: ${userId}`);
        return;
      }

      const skillMapping = COURSE_SKILL_MAPPING[courseName];
      if (!skillMapping) {
        console.log(`No skill mapping for course: ${courseName}`);
        return;
      }

      const currentSkills =
        typeof user.skillLevels === 'string'
          ? JSON.parse(user.skillLevels)
          : user.skillLevels;

      console.log('Before update:', currentSkills);

      skillMapping.skills.forEach((skill) => {
        if (currentSkills.hasOwnProperty(skill.type)) {
          currentSkills[skill.type] =
            Number(currentSkills[skill.type]) + Number(skill.points);
        } else {
          console.log(`Invalid skill type: ${skill.type}`);
        }
      });

      console.log('After update:', currentSkills);

      const updateResult = await this.userRepository.update(
        { id: userId },
        { skillLevels: currentSkills },
      );

      console.log('Update result:', updateResult);
    } catch (error) {
      console.error('Error in updateUserSkills:', error);
      throw error;
    }
  }

  async uploadExcel(file: Express.Multer.File, userId: string): Promise<void> {
    try {
      // 스킬 레벨 초기화
      await this.userRepository.update(
        { id: userId },
        {
          skillLevels: {
            ai: 0,
            cs: 0,
            language: 0,
            algorithm: 0,
            server: 0,
            ds: 0,
          },
        },
      );

      console.log('Skill levels initialized');

      // 기존 수강 과목 삭제
      await this.takenCoursesRepository.delete({ userId });

      console.log('Previous courses deleted');

      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const allData = XLSX.utils.sheet_to_json(worksheet);
      const data = allData.slice(3);

      // 새로운 과목들 처리
      for (const row of data) {
        const takenCourse = this.takenCoursesRepository.create({
          userId,
          year: Number(row['__EMPTY']) || null,
          semester: String(row['__EMPTY_1'])?.replace('학기', '') || null,
          courseNumber: Number(row['__EMPTY_2']) || null,
          courseName: String(row['__EMPTY_3']) || '',
          courseClassification: String(row['__EMPTY_4']) || '',
          courseField: String(row['__EMPTY_5']) || '',
          selectionField: String(row['__EMPTY_6']) || '',
          courseCredit: Number(row['__EMPTY_7']) || null,
          evaluation: row['__EMPTY_8'] === 'P/NP' ? 'P/NP' : 'GRADE',
          grade: String(row['__EMPTY_9']) || '',
          rating: Number(row['__EMPTY_10']) || 0.0,
          departmentCode: String(row['__EMPTY_11']) || '',
        });

        try {
          await this.takenCoursesRepository.save(takenCourse);
          await this.updateUserSkills(userId, takenCourse.courseName);
          console.log(`Processed course: ${takenCourse.courseName}`);
        } catch (error) {
          console.error('Error saving course:', error);
          throw error;
        }
      }

      // GPA 계산
      const gpa = await this.calculateGPA(userId);
      console.log('Calculated GPA:', gpa);

      // fileUpload 상태와 GPA 업데이트
      await this.userRepository.update(
        { id: userId },
        {
          fileUpload: true,
          GPA: gpa,
        },
      );

      console.log('File upload completed, user status and GPA updated');
    } catch (error) {
      console.error('Error in uploadExcel:', error);
      throw error;
    }
  }

  async getTakenCourses(userId: string): Promise<TakenCourses[]> {
    const courses = await this.takenCoursesRepository.find({
      where: { userId },
    });
    return courses;
  }

  async calculateGPA(userId: string): Promise<number> {
    const courses = await this.takenCoursesRepository.find({
      where: { userId },
    });

    let totalPoints = 0;
    let totalCredits = 0;

    const gradePoints = {
      'A+': 4.5,
      A0: 4.0,
      'B+': 3.5,
      B0: 3.0,
      'C+': 2.5,
      C0: 2.0,
      'D+': 1.5,
      D0: 1.0,
      F: 0.0,
    };

    courses.forEach((course) => {
      // P/NP 과목 제외
      if (course.evaluation === 'P/NP') {
        return;
      }

      const credit = course.courseCredit;
      const grade = course.grade;

      if (gradePoints.hasOwnProperty(grade)) {
        totalPoints += credit * gradePoints[grade];
        totalCredits += credit;
      }
    });

    // 소수점 둘째자리까지 반올림
    return totalCredits === 0
      ? 0
      : Math.round((totalPoints / totalCredits) * 100) / 100;
  }
}
