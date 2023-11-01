import { Body, Controller, Header, HttpCode, HttpException, HttpStatus, Post, Query, Req } from '@nestjs/common';
import { AuthUserLoginDTO } from '../users/authUser/authUserLoginDTO';
import { AuthUserService } from '../users/authUser/authUser.service';
import { JwtService } from '@nestjs/jwt';
import { isPasswordValid, isValidEmail } from '../utils/validation.utils';
import { AppUserRegisterDTO } from '../users/appUser/appUserRegisterDTO';
import { UserRole } from '../users/authUser/authUser.entity';
import { AppUserService } from '../users/appUser/appUser.service';
import { comparePasswords } from '../utils/hashing.utils';
import { Request } from 'express';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authUserService: AuthUserService,
    private readonly appUserService: AppUserService,
    private readonly jwtService: JwtService,
  ) {}

  /*
   * Url - domain-name/api/auth/register [POST]
   * Purpose - registering new user to the system
   * Parameters - email, password, role, login_ip
   * Return type - newly created auth user
   */
  @Post('/register')
  @Header('Content-Type', 'application/json')
  async register(@Body() body: AppUserRegisterDTO, @Query('role') role: UserRole): Promise<string | null> {
    if (!role) {
      throw new HttpException('Role is required', HttpStatus.BAD_REQUEST);
    }

    // check if role is valid
    if (!Object.values(UserRole).includes(role)) {
      throw new HttpException('Invalid role', HttpStatus.BAD_REQUEST);
    }

    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      throw new HttpException('Email and password are required', HttpStatus.BAD_REQUEST);
    }

    // Validate email format
    if (!isValidEmail(email)) {
      throw new HttpException('Invalid email format', HttpStatus.BAD_REQUEST);
    }

    // Validate password length
    if (!isPasswordValid(password)) {
      throw new HttpException('Password must be at least 6 characters long', HttpStatus.BAD_REQUEST);
    }

    try {
      // Check if an AuthUser with the given email already exists
      const existingAuthUser = await this.authUserService.findOneByEmail(email);

      if (existingAuthUser) {
        // User with the same email already exists, return an error
        throw new HttpException('User with this email already exists', HttpStatus.CONFLICT);
      }

      // Create AuthUser
      const newAuthUser = await this.authUserService.create(email, password, role);

      // Create AppUser and associate it with AuthUser
      const newAppUser = await this.appUserService.create(body, newAuthUser);

      return JSON.stringify(newAppUser);
    } catch (error) {
      console.log(error);
      // Handle errors and rollback transaction if needed
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /*
   * Url - domain-name/api/auth/login[POST]
   * Purpose - login to the system using email and password
   * Parameters - email and password
   * Return type - JWT Token
   */
  @Post('/login')
  @Header('Content-Type', 'application/json')
  @HttpCode(200)
  async login(@Body() body: AuthUserLoginDTO, @Req() request: Request): Promise<string | null> {
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      throw new HttpException('Email and password are required', HttpStatus.BAD_REQUEST);
    }

    // Validate email format
    if (!isValidEmail(email)) {
      throw new HttpException('Invalid email format', HttpStatus.BAD_REQUEST);
    }

    // Validate password length
    if (!isPasswordValid(password)) {
      throw new HttpException('Password must be at least 6 characters long', HttpStatus.BAD_REQUEST);
    }

    // Authenticate user
    let user = await this.authUserService.findOneByEmail(email);

    if (!user) {
      /* User not found for given email address */
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User not found for given email address',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (await comparePasswords(password, user.password)) {
      try {
        let ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
        if (Array.isArray(ip)) {
          ip = ip[0];
        }
        await this.authUserService.updateLastLogin(user.userId, ip, new Date());

        // Generate JWT token
        const payload = { sub: user.userId, email: user.email }; // Customize payload as needed
        const token = this.jwtService.sign(payload);

        const appUser = await this.appUserService.find(user.userId);
        user = { ...user, ...appUser };

        delete user.password;
        return JSON.stringify({ access_token: token, user: user });
      } catch (error) {
        throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } else {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Invalid credentials',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
