import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NicRequest } from './nicRequest.entity';
import { Request } from '../request.entity';
import { NicRequestController } from './nicRequest.controller';
import { NicRequestService } from './nicRequest.service';
import { AppUserModule } from '../../users/appUser.module';
import { AppUser } from '../../users/appUser.entity';
import { RequestModule } from '../request.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppUser, Request, NicRequest]),
    AppUserModule,
    RequestModule,
  ],
  providers: [NicRequestService],
  controllers: [NicRequestController],
})
export class NicRequestModule {}
