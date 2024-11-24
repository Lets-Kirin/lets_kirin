import { GetUser } from '@auth/get-user.decorator';
import { ResponseDto } from '@common/dto/response.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RecommendedTimetableService } from '@recommended-timetable/recommended-timetable.service';

@Controller('recommended-timetable')
@UseGuards(AuthGuard('jwt'))
export class RecommendedTimetableController {
  constructor(
    private readonly recommendedTimetableService: RecommendedTimetableService,
  ) {}

  @Get()
  async getUserRecommendations(@Request() req): Promise<ResponseDto> {
    return await this.recommendedTimetableService.getUserRecommendations(
      req.user.userID,
    );
  }

  @Post()
  async createRecommendation(
    @Request() req,
    @Body() requestData: any,
  ): Promise<ResponseDto> {
    return await this.recommendedTimetableService.createRecommendation(
      requestData,
      req.headers.authorization, // Add the token from request headers
    );
  }

  @Delete(':courseId')
  async deleteRecommendation(
    @Param('courseId') courseId: number,
    @Headers('Authorization') token: string,
  ): Promise<ResponseDto> {
    const userId = token; // 토큰이 실제로는 userId라고 했으므로
    return this.recommendedTimetableService.deleteUserRecommendations(
      userId,
      courseId,
    );
  }
}
