import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from './request.entity';
import { AppUser } from '../users/appUser/appUser.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
    @InjectRepository(AppUser)
    private readonly appUserRepository: Repository<AppUser>,
  ) {}

  async find(request_id: string): Promise<Request | null> {
    return this.requestRepository.findOne({
      where: { request_id: request_id },
      relations: ['appUser'],
    });
  }

  async getRequestByUserId(user_id: string) {
    const appUser = await this.appUserRepository.findOneBy({ userId: user_id });
    return this.requestRepository.findOneBy({ appUser: appUser });
  }

  async createRequest(pid_type: string, req_date: Date, req_status: string, user_id: string): Promise<string | null> {
    // Getting the user who creates the request
    const appUser = await this.appUserRepository.findOne({
      where: { userId: user_id },
    });

    // Generating new request id
    const request_id: string = uuidv4();

    const newRequest = await this.requestRepository.create({
      request_id,
      pid_type,
      req_date,
      req_status,
      appUser,
    });

    await this.requestRepository.save(newRequest);

    return newRequest.request_id;
  }

  async updateRequest(request_id: string, newRequest: Request) {
    return await this.requestRepository.update({ request_id: request_id }, newRequest);
  }

  async deleteRequest(request_id: string) {
    return await this.requestRepository.delete({ request_id: request_id });
  }
}
