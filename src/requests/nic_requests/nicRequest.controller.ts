import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Header,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NicRequestService } from './nicRequest.service';
import { NicRequestPostDto } from './nicRequestPost.dto';
import { RequestService } from '../request.service';
import { AppUserService } from '../../users/appUser/appUser.service';
import { AuthGuard } from '../../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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
        const appUser = await this.appUserService.find(request.appUser.authUser.userId);

        return { ...req, ...request, ...appUser };
      }),
    );

    console.log(result);
    return JSON.stringify(result);
  }

  /*
   * Url - domain-name/request/nic [POST]
   * Purpose - saving a new nic request to the database
   * Parameters - form body data[userId, birthcert_no]
   * Return type - list of current all the nic requests
   */
  @Post('/')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('birthcertfile', {
      storage: diskStorage({
        destination: (req, res, cb) => cb(null, './uploads'),
        filename: (req, file, cb) => {
          // Defining custom file name
          const customFileName = 'birth-certificate-' + Date.now();
          const fileExtension = file.originalname.split('.').pop();
          cb(null, `${customFileName}.${fileExtension}`);
        },
      }),
    }),
  )
  @Header('Content-Type', 'multipart/form-data')
  async createNicRequest(
    @Body() body: NicRequestPostDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png)/ }),
        ],
      }),
    )
    birthcertfile: Express.Multer.File,
  ): Promise<string | null> {
    // Saving the request in the database
    const pid_type = 'NIC-Id';
    const req_date = new Date();
    const req_status = 'Pending';

    const birthcert_url = birthcertfile.filename;

    // Check whether nic Request is exists for this user id
    const request = await this.nicRequestService.getNICRequestByUserId(body.user_id);

    if (request) {
      // Request is exists
      throw new HttpException('Duplicate results', HttpStatus.BAD_REQUEST);
    }

    // Create the request entity
    const request_id = await this.nicRequestService.createNicRequest(
      pid_type,
      req_date,
      req_status,
      body.user_id,
      body.birthcert_no,
      birthcert_url,
    );

    return request_id.toString();
  }

  /*
   * Url - domain-name/request/nic/request_id?status=(new-status) [PATCH]
   * Purpose - update the status of the nic request
   * Parameters - form body data[userId, birthcert_no, birthcert_url]
   * Return type - request id
   */
  @Patch('/:request_id')
  @UseGuards(AuthGuard)
  @Header('Content-Type', 'application/json')
  async updateNICRequestStatus(@Param() params: any, @Query() query: any): Promise<string | null> {
    const request_id = params.request_id;
    const UUID_RegEx = /[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/;

    if (!request_id || !UUID_RegEx.test(request_id)) {
      // Request id is undefined or not proper format
      throw new HttpException('Invalid request id', HttpStatus.BAD_REQUEST);
    }

    // Fetching the request associated with that id
    let request = await this.nicRequestService.getNICRequest(request_id);

    if (!request) {
      // Request doesn't exsits associated with that id
      throw new HttpException('Request not found', HttpStatus.NOT_FOUND);
    }

    // Getting the new updated status
    const status = query.status;
    const validStatus = ['Pending', 'Accepted', 'Rejected'];

    if (!validStatus.includes(status)) {
      // Given status not in the proper format
      throw new HttpException('Invalid request status', HttpStatus.BAD_REQUEST);
    }

    const result = await this.nicRequestService.updateNICReqStatus(request, status);

    return JSON.stringify({ request_id: request.request_id });
  }

  /*
   * Url - domain-name/request/nic/request_id [DELETE]
   * Purpose - delete a nic request from the database
   * Parameters - from url request_id
   * Return type - deleted request id
   */
  @Delete('/:request_id')
  @UseGuards(AuthGuard)
  @Header('Content-Type', 'application/json')
  async deleteNICRequest(@Param() params: any) {
    const request_id = params.request_id;
    const UUID_RegEx = /[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/;

    if (!request_id || !UUID_RegEx.test(request_id)) {
      // Request id is undefined or not proper format
      throw new HttpException('Invalid request id', HttpStatus.BAD_REQUEST);
    }

    // Fetching the request associated with that id
    let request = await this.nicRequestService.getNICRequest(request_id);

    if (!request) {
      // Request doesn't exsits associated with that id
      throw new HttpException('Request not found', HttpStatus.NOT_FOUND);
    }

    const requestId = await this.nicRequestService.deleteNICRequest(request_id);

    return JSON.stringify({ request_id: request_id });
  }
}
