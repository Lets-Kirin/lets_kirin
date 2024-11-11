import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user.entity';

@Entity()
export class TakenCourses extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.takenCourses)
  user: User;

  @Column()
  userId: string;

  @Column({ nullable: true })
  year: number;

  @Column({ nullable: true })
  semester: string;

  @Column({ nullable: true })
  courseNumber: number;

  @Column({ nullable: true })
  courseName: string;

  @Column({ nullable: true })
  courseClassification: string;

  @Column({ nullable: true })
  courseField: string;

  @Column({ nullable: true })
  selectionField: string;

  @Column({ nullable: true })
  courseCredit: number;

  @Column({ nullable: true })
  evaluation: string;

  @Column({ nullable: true })
  grade: string;

  @Column({ nullable: true })
  rating: number;

  @Column({ nullable: true })
  departmentCode: string;
}
