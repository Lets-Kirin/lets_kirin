import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['id'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  userID: string;

  @Column()
  id: string;

  @Column()
  pw: string;

  @Column()
  name: string;
  takenCourses: any;

  @Column()
  year: string;

  @Column({
    default: '',
  })
  grade: string;

  @Column({
    default: ''
  })
  updateTime: string;

  @Column({
    default: false,
  })
  fileUpload: boolean;

  @Column('decimal', {
    precision: 3,
    scale: 2,
    default: 0.0,
  })
  GPA: number;

  @Column('text', {
    transformer: {
      to: (value: any) => JSON.stringify(value),
      from: (value: string) => JSON.parse(value),
    },
    default: JSON.stringify({
      ai: 0,
      cs: 0,
      language: 0,
      algorithm: 0,
      server: 0,
      ds: 0,
    }),
  })
  skillLevels: {
    ai: number;
    cs: number;
    language: number;
    algorithm: number;
    server: number;
    ds: number;
  };

  @Column({
    default: false,
  })
  department: string;

  @Column({
    default: false,
  })
  semester: string;
}
