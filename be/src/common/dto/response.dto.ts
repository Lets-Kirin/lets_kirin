import { Exclude, Expose } from 'class-transformer';

export class ResponseDto {
  @Expose()
  isSuccess: boolean;

  @Expose()
  code: number;

  @Exclude()
  private _message: string;

  @Exclude()
  private _result: any;

  constructor(
    isSuccess: boolean,
    message: string,
    result: any,
    code: number = 200,
  ) {
    this.isSuccess = isSuccess;
    this.code = code;
    this._message = message;
    this._result = result;
  }

  @Expose()
  get message(): string | undefined {
    return this._message || undefined;
  }

  @Expose()
  get result(): any | undefined {
    return this._result || undefined;
  }
}
