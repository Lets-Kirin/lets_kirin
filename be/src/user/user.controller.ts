import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthCredentialDto } from '../auth/dto/auth-credential.dto';
import { MyPageResponseDto } from './mypage.response.dto';
import { GetUser } from '../auth/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('mypage')
  async getMyPage(@GetUser() user: User): Promise<MyPageResponseDto> {
    return await this.userService.getMyPageInfo(user.id);
  }

  @Post()
  public async createUser(
    @Body() authCredentialDto: AuthCredentialDto,
  ): Promise<void> {
    await this.userService.createUser(authCredentialDto);
  }

  @Get()
  public async getUser(
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<User> {
    return this.userService.findOne(id);
  }

  @Delete()
  public async deleteUser(@Param('id') id: string): Promise<void> {
    await this.userService.removeUser(id);
  }

  @Get('skills')
  async getUserSkills(@GetUser() user: User) {
    return await this.userService.getUserSkills(user.id);
  }

  @Get('skill-advise')
  async getSkillAdvise(@GetUser() user: User) {
    return await this.userService.getSkillAdvise(user.id);
  }
}
