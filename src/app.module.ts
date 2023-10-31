import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppUserModule } from './users/appUser/appUser.module';
import { NicRequestModule } from './requests/nic_requests/nicRequest.module';
import { RequestModule } from './requests/request.module';
import { IcaoValidationModule } from './image-validations/icao-validation/icaoValidation.module';
import { AuthUserModule } from './users/authUser/authUser.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { dataSourceOptions } from '../db/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    AppUserModule,
    RequestModule,
    NicRequestModule,
    IcaoValidationModule,
    AuthUserModule,
    JwtModule,

    // Adding the DB configurations
    TypeOrmModule.forRoot(dataSourceOptions),
  ],
})
export class AppModule {}
