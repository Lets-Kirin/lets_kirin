export class ResponseDto {
  isSuccess: boolean;
  code: number;
  message: string;
  result: any;

  constructor(
    isSuccess: boolean,
    message: string,
    result: any,
    code: number = 200,
  ) {
    this.isSuccess = isSuccess;
    this.code = code;
    this.message = message;
    this.result = result;
  }
}
