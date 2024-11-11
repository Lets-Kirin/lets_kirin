import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ResponseDto } from 'src/common/dto/response.dto';
import { UserRepository } from 'src/user/user.repository';
import { AuthCredentialDto } from './dto/auth-credential.dto';

@Injectable()
export class AuthService {
  userService: any;
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialDto: AuthCredentialDto): Promise<ResponseDto> {
    try {
      await this.userRepository.createUser(authCredentialDto);
      return new ResponseDto(
        true,
        '회원가입에 성공했습니다.',
        '회원가입 성공',
        200,
      );
    } catch (error) {
      console.error('SignUp error:', error);

      if (error instanceof ConflictException) {
        return new ResponseDto(
          false,
          '이미 사용 중인 아이디입니다.',
          null,
          409,
        );
      } else if (error instanceof InternalServerErrorException) {
        return new ResponseDto(
          false,
          '회원 가입 중 오류가 발생했습니다.',
          null,
          500,
        );
      }

      return new ResponseDto(
        false,
        '회원 가입 중 오류가 발생했습니다.',
        null,
        500,
      );
    }
  }

  async signIn(authCredentialDto: AuthCredentialDto): Promise<ResponseDto> {
    const { id, pw } = authCredentialDto;

    try {
      const user = await this.userRepository.findOne({ where: { id } });

      // 사용자가 존재하지 않는 경우
      if (!user) {
        return new ResponseDto(
          false,
          '존재하지 않는 아이디입니다.',
          'NOT FOUND',
          404,
        );
      }

      // 비밀번호 확인
      const isPasswordValid = await bcrypt.compare(pw, user.pw);

      if (!isPasswordValid) {
        return new ResponseDto(
          false,
          '비밀번호가 일치하지 않습니다.',
          'UNAUTHORIZED',
          401,
        );
      }

      // 로그인 성공
      const payload = { id: user.id };
      const accessToken = await this.jwtService.sign(payload);

      return new ResponseDto(
        true,
        '로그인에 성공했습니다.',
        {
          accessToken,
        },
        200,
      );
    } catch (error) {
      console.error('Login error:', error);
      return new ResponseDto(
        false,
        '로그인 처리 중 오류가 발생했습니다.',
        null,
        500,
      );
    }
  }
}
