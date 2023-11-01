import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppointmentService {
  constructor(@InjectRepository(Appointment) private appointmentRepository: Repository<Appointment>) {}

  async getAllAppointments() {
    return await this.appointmentRepository.find();
  }

  async getAppointment(appointment_id: string) {
    return await this.appointmentRepository.findOneBy({ appointment_id: appointment_id });
  }

  async createAppointment(createApptDTO: CreateApptDTO) {
    const appointment_id = uuidv4();
    await this.appointmentRepository.save({ appointment_id: appointment_id, ...createApptDTO });

    return appointment_id;
  }

  async updateStatus(appointment_id: string, status: string) {
    const appointment = await this.appointmentRepository.findOneBy({ appointment_id: appointment_id });

    appointment.status = status;

    const updatedAppointment = await this.appointmentRepository.update({ appointment_id: appointment_id }, appointment);

    return updatedAppointment;
  }

  async addReferenceNumber(appointment_id: string, refNumber: string) {
    const appointment = await this.appointmentRepository.findOneBy({ appointment_id: appointment_id });

    appointment.reference_number = refNumber;

    const updatedAppointment = await this.appointmentRepository.update({ appointment_id: appointment_id }, appointment);

    return updatedAppointment;
  }
}
