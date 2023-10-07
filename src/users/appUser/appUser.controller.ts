import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AppUser } from './appUser.entity';
import { AppUserService } from './appUser.service';
import { AuthGuard } from '../../auth/auth.guard';
import { AppUserUpdateDTO } from './appUserUpdateDTO';
import { AuthUserService } from '../authUser/authUser.service';

@Controller('/users/app')
export class AppUserController {
  constructor(private readonly appUserService: AppUserService, private readonly authUserService: AuthUserService) {}

  /*
   * Url - domain-name/users[GET]
   * Purpose - fetching all the app users from the database
   * Parameters - none
   * Return type - list of current saved app users details
   */
  @Get('/')
  @UseGuards(AuthGuard)
  async getAllAppUsers(): Promise<AppUser[]> {
    const appUsers = await this.appUserService.getAllAppUsers();

    return appUsers;
  }

  /*
   * Url - domain-name/api/users/app/{id} [GET]
   * Purpose - fetch the appUser with the specified id
   * Parameters - userId
   * Return type - appUser
   */
  @Get(':id')
  @UseGuards(AuthGuard)
  @Header('Content-Type', 'application/json')
  async getAppUser(@Param() params: any): Promise<string | null> {
    // Checking the type of params.id
    const paramsId: string = params.id;
    const UUID_RegEx = /[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/;

    if (!UUID_RegEx.test(paramsId)) {
      throw new HttpException('Invalid user id', HttpStatus.BAD_REQUEST);
    }

    const appUser = await this.appUserService.find(paramsId);

    if (!appUser) {
      // No appUser exists for given userId
      throw new HttpException('App user not found!', HttpStatus.NOT_FOUND);
    }

    return JSON.stringify(appUser);
  }

  /*
   * Url - domain-name/api/users/app/{id} [PATCH]
   * Purpose - update the details of appUser
   * Parameters - userId, updated details(appUser)
   * Return type - userId(updated)
   */
  @Patch(':id')
  @UseGuards(AuthGuard)
  @Header('Content-Type', 'application/json')
  async updateAppUser(@Body() body: AppUserUpdateDTO, @Param() params: any) {
    // Checking the type of params.id
    const paramsId: string = params.id;
    const UUID_RegEx = /[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/;

    if (!UUID_RegEx.test(paramsId)) {
      throw new HttpException('Invalid user id', HttpStatus.BAD_REQUEST);
    }

    const appUser = await this.appUserService.find(paramsId);

    if (!appUser) {
      // No appUser exists for given userId
      throw new HttpException('App user not found!', HttpStatus.NOT_FOUND);
    }

    appUser.firstName = body.firstName;
    appUser.lastName = body.lastName;
    appUser.email = body.email;
    appUser.civilStatus = body.civilStatus;
    appUser.phoneNumber = body.phoneNumber;
    appUser.birthPlace = body.birthPlace;
    appUser.occupation = body.occupation;
    appUser.gender = body.gender;
    appUser.dob = new Date(body.dob);
    appUser.postalCode = body.postalCode;
    appUser.permanentAddress = body.permanentAddress;

    // Updating the existing appUser
    try {
      const updatedAppUser = await this.appUserService.update(appUser);

      return JSON.stringify(appUser.userId);
    } catch (error) {
      throw new HttpException('Internal server error!', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /*
   * Url - domain-name/api/users/app/{id} [DELETE]
   * Purpose - delete an existing appUser
   * Parameters - userId
   * Return type - appUser(deleted)
   */
  @Delete(':id')
  @UseGuards(AuthGuard)
  @Header('Content-Type', 'application/json')
  async deleteAppUser(@Param() params: any) {
    // Checking the type of params.id
    const paramsId: string = params.id;
    const UUID_RegEx = /[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/;

    if (!UUID_RegEx.test(paramsId)) {
      throw new HttpException('Invalid user id', HttpStatus.BAD_REQUEST);
    }

    const appUser = await this.appUserService.find(paramsId);

    if (!appUser) {
      // No appUser exists for given userId
      throw new HttpException('App user not found!', HttpStatus.NOT_FOUND);
    }

    // Delete appUser if exists
    try {
      await this.appUserService.delete(paramsId);
      await this.authUserService.delete(paramsId);

      return JSON.stringify(appUser.userId);
    } catch (error) {
      throw new HttpException('Internal server error!', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
