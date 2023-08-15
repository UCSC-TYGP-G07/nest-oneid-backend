import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppUser } from '../users/appUser.entity';
import { AuthController } from './auth.controller';
import { AuthUserModule } from '../users/authUser/authUser.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppUser]),
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRETE,
    }),
    AuthUserModule,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
