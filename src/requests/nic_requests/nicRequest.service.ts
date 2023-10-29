import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { NicRequest } from './nicRequest.entity';
import { EntityManager, Repository } from 'typeorm';
import { AppUser } from '../../users/appUser/appUser.entity';
import { RequestService } from '../request.service';

@Injectable()
export class NicRequestService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(NicRequest)
    private nicRequestRepository: Repository<NicRequest>,
    @InjectRepository(AppUser) private appUserRepository: Repository<AppUser>,
    private readonly requestService: RequestService,
  ) {}

  async getAllNicRequests() {
    const nicRequests = this.nicRequestRepository.find();
    return nicRequests;
  }

  async getNICRequest(request_id: string) {
    return this.nicRequestRepository.findOneBy({ request_id: request_id });
  }

  async getNICRequestByUserId(user_id: string) {
    return this.requestService.getRequestByUserId(user_id);
  }

  async createNicRequest(
    pid_type: string,
    req_date: Date,
    req_status: string,
    user_id: string,
    birthcert_no: string,
    birthcert_url: string,
  ): Promise<string | null> {
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

  async updateNICReqStatus(newNICRequest: NicRequest, status: string) {
    const fetchtedRequest = await this.requestService.find(newNICRequest.request_id);

    if (!fetchtedRequest) {
      throw new NotFoundException(null, 'Request not found in database');
    }

    fetchtedRequest.req_status = status;

    return this.requestService.updateRequest(newNICRequest.request_id, fetchtedRequest);
  }

  async deleteNICRequest(request_id: string) {
    // Deleting nic request using entity
    const requestId = await this.nicRequestRepository.delete({ request_id: request_id });
    const reqRequestId = await this.requestService.deleteRequest(request_id);

    return requestId;
  }
}
