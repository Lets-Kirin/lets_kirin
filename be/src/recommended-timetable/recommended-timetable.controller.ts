import { 
  Controller, 
  Post, 
  Get, 
  Delete, 
  Body, 
  UseGuards,
  Request
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RecommendedTimetableService } from './recommended-timetable.service';
import { ResponseDto } from '../common/dto/response.dto';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('recommended-timetable')
@UseGuards(AuthGuard('jwt'))
export class RecommendedTimetableController {
  constructor(
    private readonly recommendedTimetableService: RecommendedTimetableService,
  ) {}

  @Get()
  async getUserRecommendations(@Request() req): Promise<ResponseDto> {
    return await this.recommendedTimetableService.getUserRecommendations(req.user.userID);
  }

  @Post()
  async createRecommendation(@Request() req, @Body() requestData: any, @GetUser() user): Promise<ResponseDto> {
    return await this.recommendedTimetableService.createRecommendation(
      requestData,
      req.headers.authorization // Add the token from request headers
    );
  }

  @Delete()
  async deleteUserRecommendations(@Request() req): Promise<ResponseDto> {
    return await this.recommendedTimetableService.deleteUserRecommendations(req.user.userID);
  }
}
