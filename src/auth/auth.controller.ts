import { Body, Controller, Header, HttpCode, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
import { AuthUserLoginDTO } from '../users/authUser/authUserLoginDTO';
import { AuthUserService } from '../users/authUser/authUser.service';
import { JwtService } from '@nestjs/jwt';
import { isPasswordValid, isValidEmail } from '../utils/validation.utils';
import { AppUserRegisterDTO } from '../users/appUser/appUserRegisterDTO';
import { UserRole } from '../users/authUser/authUser.entity';
import { AppUserService } from '../users/appUser/appUser.service';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authUserService: AuthUserService,
    private readonly appUserService: AppUserService,
    private readonly jwtService: JwtService,
  ) {}

  /*
   * Url - domain-name/auth/register [POST]
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
      // Create AuthUser
      const newAuthUser = await this.authUserService.create(email, password, role);

      // Create AppUser and associate it with AuthUser
      const newAppUser = await this.appUserService.create(body, newAuthUser);

      return JSON.stringify(newAppUser);
    } catch (error) {
      // Handle errors and rollback transaction if needed
      throw new HttpException('Registration failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /*
   * Url - domain-name/auth/login[POST]
   * Purpose - login to the system using email and password
   * Parameters - email and password
   * Return type - JWT Token
   */
  @Post('/login')
  @Header('Content-Type', 'application/json')
  @HttpCode(200)
  async login(@Body() body: AuthUserLoginDTO): Promise<string | null> {
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
    const user = await this.authUserService.findOneByEmail(email);

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

    if (user.password !== password) {
      /* Incorrect password */
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Invalid credentials',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      // Generate JWT token
      const payload = { sub: user.userId, email: user.email }; // Customize payload as needed
      const token = this.jwtService.sign(payload);

      return JSON.stringify({ access_token: token });
    } catch (error) {
      throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
