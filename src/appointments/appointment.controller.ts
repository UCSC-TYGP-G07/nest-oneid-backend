import { AppointmentService } from './appointment.service';
import { Body, Controller, Get, Header, HttpException, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { MailService } from './mail.service';

@Controller('/studio/appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService, private readonly mailService: MailService) {}

  @Get('/')
  @UseGuards(AuthGuard)
  @Header('Content-Type', 'application/json')
  async getAllAppointments(): Promise<string | null> {
    const allAppointments = await this.appointmentService.getAllAppointments();
    return JSON.stringify(allAppointments);
  }

  @Get('/:appointment_id')
  @UseGuards(AuthGuard)
  @Header('Content-Type', 'application/json')
  async getAppointment(@Param() param: any): Promise<string | null> {
    const appointment_id = param.appointment_id;
    const appointment = await this.appointmentService.getAppointment(appointment_id);
    return JSON.stringify(appointment);
  }

  @Post('/')
  // @UseGuards(AuthGuard)
  @Header('Content-Type', 'application/json')
  async createAppointment(@Body() apptDTO: PostAppointmentDTO) {
    const status = 'PENDING';
    const referenceNum = null;

    // NIC validation
    const OldNIC_Regex = /^[0-9]{9}(V|v)$/;
    const NewNIC_Regex = /^[0-9]{12}$/;

    if (!OldNIC_Regex.test(apptDTO.NIC) && !NewNIC_Regex.test(apptDTO.NIC)) {
      throw new HttpException('Invalid NIC number', HttpStatus.BAD_REQUEST);
    }

    // Contact number validation
    const ContactNum_Regex = /^[0-9]{10}$/;
    if (!ContactNum_Regex.test(apptDTO.contact_num)) {
      throw new HttpException('Invalid contact number', HttpStatus.BAD_REQUEST);
    }

    // Email validation
    const Email_Regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!Email_Regex.test(apptDTO.email)) {
      throw new HttpException('Invalid email address', HttpStatus.BAD_REQUEST);
    }

    const createDTO = { status: status, reference_number: referenceNum, ...apptDTO };
    const appointment_id = await this.appointmentService.createAppointment(createDTO);

    return JSON.stringify(appointment_id);
  }

  @Post('/:appointment_id/accept')
  @UseGuards(AuthGuard)
  @Header('Content-Type', 'application/json')
  async acceptAppointment(@Param() param: any, @Body() body: any): Promise<string | null> {
    const appointment_id = param.appointment_id;
    const appointment = await this.appointmentService.getAppointment(appointment_id);

    if (!appointment || !body.reference_number) {
      throw new HttpException('Invalid appointment ID', HttpStatus.BAD_REQUEST);
    }

    // Update the reference number and status
    await this.appointmentService.updateStatus(appointment_id, 'ACCEPTED');
    await this.appointmentService.addReferenceNumber(appointment_id, body.reference_number);

    // Send the mail
    const updatedAppointment = await this.appointmentService.getAppointment(appointment_id);

    await this.mailService.sendAcceptanceMail(
      updatedAppointment.first_name,
      updatedAppointment.last_name,
      updatedAppointment.reference_number,
      updatedAppointment.email,
    );

    return JSON.stringify(updatedAppointment);
  }

  @Post('/:appointment_id/reject')
  @UseGuards(AuthGuard)
  @Header('Content-Type', 'application/json')
  async rejectAppointment(@Param() param: any, @Body() body: any): Promise<string | null> {
    const appointment_id = param.appointment_id;
    const appointment = await this.appointmentService.getAppointment(appointment_id);

    if (!appointment) {
      throw new HttpException('Invalid appointment ID', HttpStatus.BAD_REQUEST);
    }

    // Update the reference number and status
    await this.appointmentService.updateStatus(appointment_id, 'REJECTED');

    // Send the mail
    const updatedAppointment = await this.appointmentService.getAppointment(appointment_id);
    const reason = param.reason;

    await this.mailService.sendRejectionMail(
      updatedAppointment.first_name,
      updatedAppointment.last_name,
      reason,
      updatedAppointment.email,
    );

    return JSON.stringify(updatedAppointment);
  }
}

interface PostAppointmentDTO {
  first_name: string;
  last_name: string;
  NIC: string;
  address: string;
  contact_num: string;
  email: string;
}
