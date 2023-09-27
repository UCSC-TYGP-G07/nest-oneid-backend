import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from './request.entity';
import { AppUserModule } from '../users/appUser/appUser.module';
import { RequestService } from './request.service';
import { AppUser } from '../users/appUser/appUser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Request, AppUser]), AppUserModule],
  providers: [RequestService],
  exports: [RequestService],
})
export class RequestModule {}
