import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from './request.entity';
import { AppUser } from '../users/appUser.entity';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
    @InjectRepository(AppUser)
    private readonly appUserRepository: Repository<AppUser>,
  ) {}

  async find(request_id: number): Promise<Request | null> {
    return this.requestRepository.findOne({
      where: { request_id: request_id },
      relations: ['appUser'],
    });
  }

  async createRequest(pid_type: string, req_date: Date, req_status: string, user_id: number): Promise<number | null> {
    // Getting the user who creates the request
    const appUser = await this.appUserRepository.findOne({
      where: { user_id: user_id },
    });

    const newRequest = await this.requestRepository.create({
      pid_type,
      req_date,
      req_status,
      appUser,
    });

    await this.requestRepository.save(newRequest);

    return newRequest.request_id;
  }
}
