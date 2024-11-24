import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { JwtService } from '@auth/jwt.service';
import { JwtStrategy } from '@auth/jwt.strategy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@user/user.module';
import { UserRepository } from '@user/user.repository';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtService],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
