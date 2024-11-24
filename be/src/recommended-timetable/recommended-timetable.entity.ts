import { User } from 'src/user/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';

@Entity()
export class RecommendedTimetable extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userID: string;

  @Column('simple-json', { default: '[]' })
  courses: {
    courseName: string;
    courseNumber: string;
    sectionNumber: number;
    professorName: string;
    reasonForRecommendingClass: string;
  }[];
}
