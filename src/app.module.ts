import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppUserModule } from './users/appUser.module';
import { AppUser } from './users/appUser.entity';
import { NicRequestModule } from './requests/nic_requests/nicRequest.module';
import { NicRequest } from './requests/nic_requests/nicRequest.entity';
import { RequestModule } from './requests/request.module';
import { Request } from './requests/request.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AppUserModule,
    RequestModule,
    NicRequestModule,

    // Adding the postgresql configurations
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [AppUser, Request, NicRequest],
    }),
  ],
})
export class AppModule {}
