import { User } from 'src/user/user.entity';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RecommendedTimetable extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userID: string;

  @Column()
  courseName: string;

  @Column()
  courseNumber: string;

  @Column()
  sectionNumber: number;

  @Column()
  professorName: string;

  @Column('text')
  reasonForRecommendingClass: string;
}
