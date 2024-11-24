import { ResponseDto } from '@common/dto/response.dto';

export const ResponseTemplate = {
  SIGNUP_SUCCESS: () =>
    new ResponseDto(true, '회원가입에 성공했습니다.', '회원가입 성공', 200),
  DUPLICATE_ID: () =>
    new ResponseDto(false, '이미 사용 중인 아이디입니다.', null, 409),
  SIGNUP_ERROR: () =>
    new ResponseDto(false, '회원 가입 중 오류가 발생했습니다.', null, 500),

  LOGIN_SUCCESS: (accessToken: string) =>
    new ResponseDto(true, '로그인에 성공했습니다.', { accessToken }, 200),
  USER_NOT_FOUND: () =>
    new ResponseDto(false, '존재하지 않는 아이디입니다.', null, 404),
  INVALID_PASSWORD: () =>
    new ResponseDto(false, '비밀번호가 일치하지 않습니다.', null, 401),
  LOGIN_ERROR: () =>
    new ResponseDto(false, '로그인 처리 중 오류가 발생했습니다.', null, 500),

  NO_RECOMMENDED_TIMETABLE: () =>
    new ResponseDto(false, '추천된 시간표가 없습니다.', null, 404),
  DELETE_RECOMMENDED_TIMETABLE_SUCCESS: () =>
    new ResponseDto(true, '시간표가 성공적으로 삭제되었습니다.', null, 200),
  DELETE_RECOMMENDED_TIMETABLE_ERROR: () =>
    new ResponseDto(false, '시간표 삭제에 실패했습니다.', null, 500),
};
