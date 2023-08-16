import { Controller } from '@nestjs/common';
import { AuthUserService } from './authUser.service';

@Controller('/appUser/')
export class AuthUserController {
  constructor(private readonly authUserService: AuthUserService) {}
}
