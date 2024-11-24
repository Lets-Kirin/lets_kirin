import { User } from 'src/user/user.entity';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RecommendedTimetable extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userID: string;

  @Column('simple-json')
  courses: {
    courseName: string;
    courseNumber: string;
    sectionNumber: number;
    professorName: string;
    reasonForRecommendingClass: string;
  }[];
}