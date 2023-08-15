import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthUser } from './authUser.entity';
import { AuthUserService } from './authUser.service';
import { AuthUserController } from './authUser.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AuthUser])],
  providers: [AuthUserService],
  controllers: [AuthUserController],
})
export class AuthUserModule {}
