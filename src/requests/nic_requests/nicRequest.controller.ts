import { Body, Controller, Get, Header, Post } from '@nestjs/common';
import { NicRequestService } from './nicRequest.service';

@Controller('/request/nic')
export class NicRequestController {
  constructor(private readonly nicRequestService: NicRequestService) {}

  /*
   * Url - domain-name/request/nic [GET]
   * Purpose - fetching all the nic requests from the database
   * Parameters - none
   * Return type - list of current all the nic requests
   */
  @Get('/')
  @Header('content-type', 'application/json')
  getAllNicRequests(): string {
    return 'Get request made!';
  }

  /*
   * Url - domain-name/request/nic [POST]
   * Purpose - saving a new nic request to the database
   * Parameters - form body data[
   * Return type - list of current all the nic requests
   */
  @Post('/')
  @Header('content-type', 'application/json')
  async createNicRequest(
    @Body('user_id') user_id: number,
    @Body('birthcert_no') birthcert_no: string,
    @Body('birthcert_url') birthcert_url: string,
  ): Promise<string> {
    // Saving the request in the database
    const pid_type = 'NIC-Id';
    const req_date = new Date();
    const req_status = 'Pending';

    const { request_id } = await this.nicRequestService.createNicRequest(
      pid_type,
      req_date,
      req_status,
      user_id,
      birthcert_no,
      birthcert_url,
    );

    return request_id.toString();
  }
}
