import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Courses {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  department_major: string;

  @Column()
  courseNumber: string;

  @Column()
  sectionNumber: number;

  @Column()
  courseName: string;

  @Column()
  lectureLanguage: string;

  @Column()
  courseClassification: string;

  @Column()
  electiveArea: string;

  @Column()
  yearSemester: number;

  @Column()
  targetCourse: string;

  @Column()
  mainDepartment: string;

  @Column()
  professorName: string;

  @Column()
  classroom: string;

  @Column()
  onlineCourse: string;

  @Column()
  credits: number;

  @Column()
  courseDescription: string;

  @Column()
  BSM: boolean;

  @Column()
  MSC: boolean;

  @Column()
  courseDay: string;

  @Column()
  courseTime: string;
}
