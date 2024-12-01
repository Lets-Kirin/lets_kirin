import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthCredentialDto } from 'src/auth/dto/auth-credential.dto';
import { MyPageResponseDto } from './mypage.response.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { ResponseDto } from 'src/common/dto/response.dto';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  
  signIn(): { accessToken: string } | PromiseLike<{ accessToken: string }> {
    throw new Error('Method not implemented.');
  }
  constructor(
    private readonly userRepository: UserRepository,
    private readonly httpService: HttpService
  ) {}

  async createUser(authCredentialDto: AuthCredentialDto): Promise<void> {
    await this.userRepository.createUser(authCredentialDto);
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async removeUser(id: string) {
    const user = await this.findOne(id);
    if (user) {
      await this.userRepository.remove(user);
    }
  }

  async getMyPageInfo(userId: string): Promise<MyPageResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // skillLevels가 문자열로 저장되어 있다면 파싱
    const skillLevels =
      typeof user.skillLevels === 'string'
        ? JSON.parse(user.skillLevels)
        : user.skillLevels;

    return {
      name: user.name,
      year: user.year,
      fileUpload: user.fileUpload,
      averageGrade: user.GPA,
      updateTime: user.updateTime,
      skillLevel: {
        algorithm: skillLevels.algorithm,
        language: skillLevels.language,
        server: skillLevels.server,
        cs: skillLevels.cs,
        ds: skillLevels.ds,
        ai: skillLevels.ai,
      },
    };
  }

  async getUserSkills(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // skillLevels가 문자열로 저장되어 있다면 파싱
    const skillLevels =
      typeof user.skillLevels === 'string'
        ? JSON.parse(user.skillLevels)
        : user.skillLevels;

    return {
      skillLevels: {
        ai: skillLevels.ai,
        cs: skillLevels.cs,
        language: skillLevels.language,
        algorithm: skillLevels.algorithm,
        server: skillLevels.server,
        ds: skillLevels.ds,
      }
    };
  }

  async getSkillAdvise(id: string): Promise<ResponseDto> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new HttpException(
          '사용자를 찾을 수 없습니다.',
          HttpStatus.NOT_FOUND,
        );
      }

      const aiRequestData = {
        ai : user.skillLevels.ai,
        cs : user.skillLevels.cs,
        language : user.skillLevels.language,
        algorithm : user.skillLevels.algorithm,
        server : user.skillLevels.server,
        ds : user.skillLevels.ds
      };

      const aiResponse = await firstValueFrom(this.httpService.post(
        process.env.AI_SERVICE_URL + '/skill/recommend',
        aiRequestData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      ));

      return new ResponseDto(
        true,
        "역량 Advise 성공",
        aiResponse.data,
        HttpStatus.OK
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
