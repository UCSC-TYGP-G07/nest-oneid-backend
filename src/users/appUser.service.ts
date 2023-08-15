import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppUser } from './appUser.entity';

@Injectable()
export class AppUserService {
  constructor(
    @InjectRepository(AppUser)
    private readonly appUserRepository: Repository<AppUser>,
  ) {}

  /*
   * Fetching all the appUsers from db
   */
  async getAllAppUsers(): Promise<AppUser[]> {
    return this.appUserRepository.find();
  }

  async find(user_id: number): Promise<AppUser | null> {
    return this.appUserRepository.findOne({ where: { user_id: user_id } });
  }
}
