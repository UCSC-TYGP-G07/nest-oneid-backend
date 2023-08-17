import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppUser } from './appUser.entity';
import { AppUserService } from './appUser.service';
import { AuthGuard } from '../../auth/auth.guard';

@Controller('/users/app')
export class AppUserController {
  constructor(private readonly appUserService: AppUserService) {}

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
}
