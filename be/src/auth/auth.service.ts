import { AuthCredentialDto } from '@auth/dto/auth-credential.dto';
import { ResponseDto } from '@common/dto/response.dto';
import { ResponseTemplate } from '@common/dto/response.template';
import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@auth/jwt.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '@user/user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialDto: AuthCredentialDto): Promise<ResponseDto> {
    try {
      await this.userRepository.createUser(authCredentialDto);
      return ResponseTemplate.SIGNUP_SUCCESS();
    } catch (error) {
      console.error('SignUp error:', error);

      if (error instanceof ConflictException) {
        return ResponseTemplate.DUPLICATE_ID();
      }

      return ResponseTemplate.SIGNUP_ERROR();
    }
  }

  async signIn(authCredentialDto: AuthCredentialDto): Promise<ResponseDto> {
    const { id, pw } = authCredentialDto;

    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        return ResponseTemplate.USER_NOT_FOUND();
      }

      const isPasswordValid = await bcrypt.compare(pw, user.pw);

      if (!isPasswordValid) {
        return ResponseTemplate.INVALID_PASSWORD();
      }

      const payload = { userID: user.userID };
      const accessToken = await this.jwtService.generateAccessToken(payload);

      return ResponseTemplate.LOGIN_SUCCESS(accessToken);
    } catch (error) {
      console.error('Login error:', error);
      return ResponseTemplate.LOGIN_ERROR();
    }
  }
}
