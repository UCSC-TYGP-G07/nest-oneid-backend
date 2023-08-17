import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NicRequest } from './nicRequest.entity';
import { Repository } from 'typeorm';
import { AppUser } from '../../users/appUser/appUser.entity';
import { RequestService } from '../request.service';

@Injectable()
export class NicRequestService {
  constructor(
    @InjectRepository(NicRequest)
    private nicRequestRepository: Repository<NicRequest>,
    @InjectRepository(AppUser) private appUserRepository: Repository<AppUser>,
    private readonly requestService: RequestService,
  ) {}

  async getAllNicRequests() {
    const nicRequests = this.nicRequestRepository.find();
    return nicRequests;
  }

  async createNicRequest(
    pid_type: string,
    req_date: Date,
    req_status: string,
    user_id: string,
    birthcert_no: string,
    birthcert_url: string,
  ): Promise<number | null> {
    // Fetching the app user from the db
    // const appUser = await this.appUserRepository.findOne({
    //   where: { authUser : user_id },
    // });

    // if (!appUser) {
    //   throw new NotFoundException("Appuser doesn't exists.");
    // }

    // Create the request which inherits from the request
    const request_id = await this.requestService.createRequest(pid_type, req_date, req_status, user_id);

    const request = await this.requestService.find(request_id);

    const newNicRequest = await this.nicRequestRepository.create({
      request_id,
      birthcert_no,
      birthcert_url,
      request,
    });

    // Saving the nicRequest in the database
    await this.nicRequestRepository.save(newNicRequest);

    return newNicRequest.request.request_id;
  }
}
