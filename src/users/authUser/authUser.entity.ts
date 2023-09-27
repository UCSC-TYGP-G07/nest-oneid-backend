import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  APP_USER = 'app-user',
  GOV_OFFICER = 'gov-officer',
  ORGANISATION = 'organisation',
}

@Entity('Auth_User')
export class AuthUser {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId: string;

  @Column({ name: 'email', nullable: false, length: 36, unique: true })
  email: string;

  @Column({ name: 'password', nullable: false, length: 64 })
  password: string;

  @Column({ name: 'role', type: 'enum', enum: UserRole, nullable: false })
  role: UserRole;

  @Column({ name: 'created_date', nullable: false })
  createdDate: Date;

  @Column({ name: 'last_login_date', nullable: true })
  lastLoginDate: Date;

  @Column({ name: 'password_expiry_date', nullable: false })
  passwordExpiryDate: Date;

  @Column({ name: 'is_locked', nullable: false })
  isLocked: boolean;

  @Column({ name: 'last_login_ip', nullable: true })
  lastLoginIP: string;
}
