import { Module } from '@nestjs/common';
import { AppUser } from './appUser.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppUserService } from './appUser.service';
import { AppUserController } from './appUser.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AppUser])],
  providers: [AppUserService],
  controllers: [AppUserController],
})
export class AppUserModule {}
