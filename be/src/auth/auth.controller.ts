import { Body, Controller, Post } from '@nestjs/common';
import { ResponseDto } from 'src/common/dto/response.dto';
import { User } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  public async signUp(
    @Body() authCredentialDto: AuthCredentialDto,
  ): Promise<ResponseDto> {
    return await this.authService.signUp(authCredentialDto);
  }

  @Post('/signin')
  public async signIn(
    @Body() authCredentialDto: AuthCredentialDto,
  ): Promise<ResponseDto> {
    return this.authService.signIn(authCredentialDto);
  }

  @Post('/authTest')
  test(@GetUser() user: User) {
    console.log('user', user);
  }
}
