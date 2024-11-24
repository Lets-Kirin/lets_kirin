import { User } from 'src/user/user.entity';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

@Entity()
export class RecommendedTimetable extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userID: string;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'userID' })
  user: User;

  @Column('simple-json')
  courses: {
    courseName: string;
    courseNumber: string;
    sectionNumber: number;
    professorName: string;
    reasonForRecommendingClass: string;
  }[];
}