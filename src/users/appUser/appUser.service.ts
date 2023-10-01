import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
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
    return this.appUserRepository.findOneBy({ userId: user_id });
  }

  async update(appUser: AppUser): Promise<UpdateResult> {
    return this.appUserRepository.update({ userId: appUser.userId }, appUser);
  }

  async delete(userId: string): Promise<DeleteResult> {
    return this.appUserRepository.delete({ userId: userId });
  }
}
