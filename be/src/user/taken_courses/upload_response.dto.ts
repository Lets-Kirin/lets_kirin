import { ResponseDto } from 'src/common/dto/response.dto';

export class UploadResponseDto extends ResponseDto {
  fileUpload: boolean;
  updateTime: string;

  constructor(
    message: string = '업로드에 성공하였습니다.',
    result: any = '업로드 성공',
    fileUpload: boolean = true,
    updateTime: string = new Date().toISOString().split('T')[0],
  ) {
    super(true, message, result);
    this.fileUpload = fileUpload;
    this.updateTime = updateTime;
  }
}
