import { Module } from '@nestjs/common';
import { AppUser } from './appUser.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppUserService } from './appUser.service';
import { AppUserController } from './appUser.controller';
import { AuthModule } from '../../auth/auth.module';
import { AuthUserModule } from '../authUser/authUser.module';

@Module({
  imports: [TypeOrmModule.forFeature([AppUser]), AuthModule, AuthUserModule],
  providers: [AppUserService],
  controllers: [AppUserController],
  exports: [AppUserService],
})
export class AppUserModule {}
