export class CourseInfoDto {
  courseName: string;
  courseNumber: string;
  sectionNumber: number;
  professorName: string;
  courseDay: string;
  courseTime: string;
  classroom: string;
}

export class RecommendedCourseSetDto {
  courseID: number;
  courses: CourseInfoDto[];
}

export class TimetableResponseDto {
  recommendedCourses: RecommendedCourseSetDto[];
} 