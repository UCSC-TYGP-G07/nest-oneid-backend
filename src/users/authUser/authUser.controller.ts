import { Body, Controller, Header, Post } from '@nestjs/common';
import { AuthUserSignupDto } from './authUser.signup.dto';
import { AuthUserService } from './authUser.service';

@Controller('/auth/')
export class AuthUserController {
  constructor(private readonly authUserService: AuthUserService) {}

  /*
   * Url - domain-name/auth/signup[POST]
   * Purpose - registering new user to the system
   * Parameters - email, password, role, login_ip
   * Return type - newly created auth user
   */

  @Post('/signup')
  @Header('Content-Type', 'application/json')
  async signup(@Body() body: AuthUserSignupDto): Promise<string | null> {
    const email = body.email;
    const password = body.password; // Supposed password hashed(Using SHA-256)
    const role = body.role;
    const last_login_ip = body.last_login_ip;

    /* Creating new auth user in database */
    const newAuthUser = await this.authUserService.create(email, password, role, last_login_ip);

    return JSON.stringify(newAuthUser);
  }
}
