import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendAcceptanceMail(first_name: string, last_name: string, reference_number: string, email: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to OneID Studio!',
      template: './Accept',
      context: {
        first_name: first_name,
        last_name: last_name,
        reference_number: reference_number,
      },
    });
  }

  async sendRejectionMail(first_name: string, last_name: string, reason: string, email: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Rejection of the appointment(from OneID Studio)',
      template: './Reject',
      context: {
        first_name: first_name,
        last_name: last_name,
        reason: reason,
      },
    });
  }
}
