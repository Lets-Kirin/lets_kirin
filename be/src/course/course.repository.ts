import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Courses } from './course.entity';

@Injectable()
export class CourseRepository extends Repository<Courses> {
  constructor(private dataSource: DataSource) {
    super(Courses, dataSource.createEntityManager());
  }
}
