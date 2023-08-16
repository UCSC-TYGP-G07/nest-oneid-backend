import { Body, Controller, Header, HttpException, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { AuthUserSignupDto } from '../users/authUser/authUser.signup.dto';
import { AuthUserLoginDto } from '../users/authUser/authUser.login.dto';
import { AuthUserService } from '../users/authUser/authUser.service';
import { JwtService } from '@nestjs/jwt';

@Controller('/auth')
export class AuthController {
  constructor(private readonly appUserService: AuthUserService, private readonly jwtService: JwtService) {}

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
    const newAuthUser = await this.appUserService.create(email, password, role, last_login_ip);

    return JSON.stringify(newAuthUser);
  }

  /*
   * Url - domain-name/auth/login[POST]
   * Purpose - login to the system using email and password
   * Parameters - email and password
   * Return type - JWT Token
   */
  @Post('/login')
  @Header('Content-Type', 'application/json')
  async login(@Body() body: AuthUserLoginDto): Promise<string | null> {
    const email = body.email;
    const password = body.password; // Supposed password in SHA-256

    const user = await this.appUserService.findOneByEmail(email);

    if (!user) {
      /* User not found for given email address */
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Entered user not exists! Please check email',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    /* User exists, checking the password */
    if (user.password !== password) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.user_id, email: user.email };

    return JSON.stringify({ access_token: await this.jwtService.signAsync(payload) });
  }
}
