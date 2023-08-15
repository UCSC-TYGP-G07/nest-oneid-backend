import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthUser } from './authUser.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthUserService {
  constructor(@InjectRepository(AuthUser) private authUserRepository: Repository<AuthUser>) {}

  /* Getting all AuthUsers */
  async findAll(): Promise<AuthUser[] | null> {
    return this.authUserRepository.find();
  }

  /* Getting AuthUser by the user id */
  async findOneById(user_id: string): Promise<AuthUser | null> {
    return this.authUserRepository.findOne({ where: { user_id: user_id } });
  }

  /* Getting AuthUser by the username */
  async findOneByEmail(email: string): Promise<AuthUser | null> {
    return this.authUserRepository.findOne({ where: { email: email } });
  }

  /* Creating new AuthUser */
  async create(email: string, password: string, role: string, last_login_ip: string): Promise<AuthUser | null> {
    const created_date = new Date();
    const last_login_date = created_date;
    const password_expiry_date = new Date(created_date.getTime() + 7 * 24 * 60 * 60 * 1000);
    const is_locked = false;
    const user_id = uuid();

    const newAuthUser = await this.authUserRepository.create({
      user_id,
      email,
      password,
      role,
      created_date,
      last_login_date,
      last_login_ip,
      password_expiry_date,
      is_locked,
    });

    return this.authUserRepository.save(newAuthUser);
  }

  /* Updating existing authUser */
  async update(
    user_id: string,
    email: string,
    password: string,
    role: string,
    last_login_ip: string,
    last_login_date: Date,
    created_date: Date,
    password_expiry_date: Date,
    is_locked: boolean,
  ): Promise<AuthUser | null> {
    return this.authUserRepository.save({
      user_id,
      email,
      password,
      role,
      password_expiry_date,
      last_login_ip,
      last_login_date,
      created_date,
      is_locked,
    });
  }

  /* Deleting an exisiting AuthUser */
  async delete(user_id: string): Promise<AuthUser | null> {
    const authUser = await this.authUserRepository.findOne({ where: { user_id: user_id } });
    return this.authUserRepository.remove(authUser);
  }
}
