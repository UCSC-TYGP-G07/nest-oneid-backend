import { Body, Controller, Get, Header, Post, UseGuards } from '@nestjs/common';
import { NicRequestService } from './nicRequest.service';
import { NicRequestPostDto } from './nicRequestPost.dto';
import { RequestService } from '../request.service';
import { AppUserService } from '../../users/appUser.service';
import { AuthGuard } from '../../auth/auth.guard';

@Controller('/request/nic')
export class NicRequestController {
  constructor(
    private readonly requestService: RequestService,
    private readonly appUserService: AppUserService,
    private readonly nicRequestService: NicRequestService,
  ) {}

  /*
   * Url - domain-name/request/nic [GET]
   * Purpose - fetching all the nic requests from the database
   * Parameters - none
   * Return type - list of current all the nic requests
   */
  @Get('/')
  @UseGuards(AuthGuard)
  @Header('Content-Type', 'application/json')
  async getAllNicRequests(): Promise<string | null> {
    // Fetching the Nic Request
    const allRequests = await this.nicRequestService.getAllNicRequests();

    const result = await Promise.all(
      allRequests.map(async (req) => {
        // Getting the request entity
        const request = await this.requestService.find(req.request_id);

        // Getting the user who created this request
        const appUser = await this.appUserService.find(request.appUser.user_id);

        return { ...req, ...request, ...appUser };
      }),
    );

    console.log(result);
    return JSON.stringify(result);
  }

  /*
   * Url - domain-name/request/nic [POST]
   * Purpose - saving a new nic request to the database
   * Parameters - form body data[user_id, birthcert_no, birthcert_url]
   * Return type - list of current all the nic requests
   */
  @Post('/')
  @UseGuards(AuthGuard)
  @Header('Content-Type', 'application/json')
  async createNicRequest(@Body() body: NicRequestPostDto): Promise<string | null> {
    // Saving the request in the database
    const pid_type = 'NIC-Id';
    const req_date = new Date();
    const req_status = 'Pending';

    // Create the request entity
    const request_id = await this.nicRequestService.createNicRequest(
      pid_type,
      req_date,
      req_status,
      body.user_id,
      body.birthcert_no,
      body.birthcert_url,
    );

    return JSON.stringify({ request_id: request_id });
  }
}
