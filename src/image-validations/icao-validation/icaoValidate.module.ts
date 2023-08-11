import { Module } from '@nestjs/common';
import { IcaoValidateController } from './icaoValidate.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule.register({ timeout: 5000, maxRedirects: 5 })],
  controllers: [IcaoValidateController],
  providers: [],
})
export class IcaoValidateModule {}
