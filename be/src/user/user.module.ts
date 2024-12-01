import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), HttpModule],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserService, UserRepository],
})
export class UserModule {}
