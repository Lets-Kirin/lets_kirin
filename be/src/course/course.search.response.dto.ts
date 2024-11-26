export class CourseSearchResponseDto {
  id: number;
  department_major: string;
  courseNumber: string;
  sectionNumber: number;
  courseName: string;
  courseClassification: string;
  credits: number;
  professorName: string;
  courseDay: string;
  courseTime: string;
  classroom: string;

  constructor(course: any) {
    // 엔티티로부터 DTO를 생성하는 생성자
    this.id = course.id;
    this.department_major = course.department_major;
    this.courseNumber = course.courseNumber;
    this.sectionNumber = course.sectionNumber;
    this.courseName = course.courseName;
    this.courseClassification = course.courseClassification;
    this.credits = course.credits;
    this.professorName = course.professorName;
    this.courseDay = course.courseDay;
    this.courseTime = course.courseTime;
    this.classroom = course.classroom;
  }
}
