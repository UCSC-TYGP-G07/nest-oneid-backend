import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppUser } from '../users/appUser/appUser.entity';
import { AuthController } from './auth.controller';
import { AuthUserModule } from '../users/authUser/authUser.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './auth.guard';
import { AppUserService } from '../users/appUser/appUser.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppUser]),
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    AuthUserModule,
  ],
  providers: [AuthGuard, AppUserService],
  controllers: [AuthController],
  exports: [AuthGuard],
})
export class AuthModule {}
