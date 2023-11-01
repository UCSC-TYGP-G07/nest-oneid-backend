import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthUser, UserRole } from './authUser.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { hashPassword } from '../../utils/hashing.utils';

@Injectable()
export class AuthUserService {
  constructor(@InjectRepository(AuthUser) private authUserRepository: Repository<AuthUser>) {}

  /* Getting all AuthUsers */
  async findAll(): Promise<AuthUser[] | null> {
    return this.authUserRepository.find();
  }

  /* Getting AuthUser by the user id */
  async findOneById(user_id: string): Promise<AuthUser | null> {
    return this.authUserRepository.findOne({ where: { userId: user_id } });
  }

  /* Getting AuthUser by the username */
  async findOneByEmail(email: string): Promise<AuthUser | null> {
    return this.authUserRepository.findOne({ where: { email: email } });
  }

  /* Creating new AuthUser */
  async create(email: string, password: string, role: UserRole): Promise<AuthUser | null> {
    const userId = uuid();
    const createdDate = new Date();
    const lastLoginDate = null;
    const passwordExpiryDate = new Date(createdDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const isLocked = false;
    const lastLoginIP = null;

    const hashedPassword = await hashPassword(password);

    const newAuthUser = this.authUserRepository.create({
      userId: userId,
      email,
      password: hashedPassword,
      role,
      createdDate,
      lastLoginDate,
      lastLoginIP,
      passwordExpiryDate,
      isLocked,
    });

    return this.authUserRepository.save(newAuthUser);
  }

  //
  // /* Updating existing authUser */
  // async update(
  //   userId: string,
  //   email: string,
  //   password: string,
  //   role: string,
  //   last_login_ip: string,
  //   last_login_date: Date,
  //   created_date: Date,
  //   password_expiry_date: Date,
  //   is_locked: boolean,
  // ): Promise<AuthUser | null> {
  //   return this.authUserRepository.save({
  //     userId,
  //     email,
  //     password,
  //     role,
  //     password_expiry_date,
  //     last_login_ip,
  //     last_login_date,
  //     created_date,
  //     is_locked,
  //   });
  // }

  /* Deleting an existing AuthUser */
  async delete(user_id: string): Promise<AuthUser | null> {
    const authUser = await this.authUserRepository.findOne({ where: { userId: user_id } });
    return this.authUserRepository.remove(authUser);
  }
}
