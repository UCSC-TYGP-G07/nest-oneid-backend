import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from './request.entity';
import { AppUserModule } from '../users/appUser.module';

@Module({
  imports: [TypeOrmModule.forFeature([Request]), AppUserModule],
  exports: [RequestModule],
})
export class RequestModule {}
