import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Courses {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  department_major: string;

  @Column()
  course_number: string;

  @Column()
  section_number: number;

  @Column()
  course_name: string;

  @Column()
  lecture_language: string;

  @Column()
  course_classification: string;

  @Column()
  elective_area: string;

  @Column()
  credits_theory_practice: string;

  @Column()
  year_semester: number;

  @Column()
  target_course: string;

  @Column()
  course_summary: string;

  @Column()
  syllabus: string;

  @Column()
  main_department: string;

  @Column()
  professor_name: string;

  @Column()
  day_time: string;

  @Column()
  classroom: string;

  @Column()
  online_course: string;

  @Column()
  credits: number;
}
