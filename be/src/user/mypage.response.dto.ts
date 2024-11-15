export class MyPageResponseDto {
  name: string;
  year: string;
  fileUpload: boolean;
  averageGrade: number;
  updateTime: string;
  skillLevel: {
    algorithm: number;
    language: number;
    server: number;
    cs: number;
    ds: number;
    ai: number;
  };
}
