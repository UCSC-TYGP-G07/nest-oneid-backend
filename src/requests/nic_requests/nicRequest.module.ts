import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NicRequest } from './nicRequest.entity';
import { NicRequestController } from './nicRequest.controller';
import { NicRequestService } from './nicRequest.service';
import { AppUserModule } from '../../users/appUser.module';

@Module({
  imports: [TypeOrmModule.forFeature([NicRequest]), AppUserModule],
  providers: [NicRequestService],
  controllers: [NicRequestController],
  exports: [NicRequestModule],
})
export class NicRequestModule {}
