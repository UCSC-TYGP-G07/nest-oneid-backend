import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppUser } from './appUser.entity';
import { AuthUser } from '../authUser/authUser.entity';
import { AppUserCreateDTO } from './appUserCreateDTO';

@Injectable()
export class AppUserService {
  constructor(
    @InjectRepository(AppUser)
    private readonly appUserRepository: Repository<AppUser>,
  ) {}

  /* Creating new AppUser and associating it with AuthUser */
  async create(data: AppUserCreateDTO, authUser: AuthUser): Promise<AppUser | null> {
    const newAppUser: AppUser = this.appUserRepository.create({
      authUser,
      ...data,
    });

    return this.appUserRepository.save(newAppUser);
  }

  /*
   * Fetching all the appUsers from db
   */
  async getAllAppUsers(): Promise<AppUser[]> {
    return this.appUserRepository.find();
  }

  async find(user_id: string): Promise<AppUser | null> {
    return this.appUserRepository.findOne({ where: { userId: user_id } });
  }
}
