import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { AppointmentService } from './appointment.service';
import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { MailModule } from './mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment]), MailModule],
  providers: [AppointmentService],
  controllers: [AppointmentController],
})
export class AppointmentModule {}
