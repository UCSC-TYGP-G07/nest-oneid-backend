import { Module } from '@nestjs/common';
import { IcaoValidationController } from './icaoValidation.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule.register({ timeout: 5000, maxRedirects: 5 })],
  controllers: [IcaoValidationController],
  providers: [],
})
export class IcaoValidationModule {}
