import { Module } from '@nestjs/common';
import { AppUser } from './appUser.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppUserService } from './appUser.service';
import { AppUserController } from './appUser.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([AppUser]), AuthModule],
  providers: [AppUserService],
  controllers: [AppUserController],
  exports: [AppUserService],
})
export class AppUserModule {}
