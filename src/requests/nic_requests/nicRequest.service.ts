import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NicRequest } from './nicRequest.entity';
import { Repository } from 'typeorm';
import { AppUser } from '../../users/appUser.entity';

@Injectable()
export class NicRequestService {
  constructor(
    @InjectRepository(NicRequest)
    private nicRequestRepository: Repository<NicRequest>,
    @InjectRepository(AppUser) private appUserRepository: Repository<AppUser>,
  ) {}

  async getAllNICRequests() {
    const nicRequests = this.nicRequestRepository.find();
    return nicRequests;
  }

  async createNicRequest(
    pid_type: string,
    req_date: Date,
    req_status: string,
    user_id: number,
    birthcert_no: string,
    birthcert_url: string,
  ): Promise<{ request_id: number }> {
    // Fetching the app user from the db
    const appUser = await this.appUserRepository.findOne({
      where: { user_id: user_id },
    });

    if (!appUser) {
      throw new NotFoundException("Appuser does't exists.");
    }

    const newNicRequest = await this.nicRequestRepository.create({
      pid_type,
      req_date,
      req_status,
      appUser,
      birthcert_no,
      birthcert_url,
    });
    // Saving the nicRequest in the database
    await this.nicRequestRepository.save(newNicRequest);

    return { request_id: newNicRequest.request_id };
  }
}
