import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Auth_User')
export class AuthUser {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({ nullable: false, length: 36, unique: true })
  email: string;

  @Column({ nullable: false, length: 64 })
  password: string;

  @Column({ nullable: false, length: 36 })
  role: string;

  @Column({ nullable: false })
  created_date: Date;

  @Column()
  last_login_date: Date;

  @Column({ nullable: false })
  password_expiry_date: Date;

  @Column({ nullable: false })
  is_locked: boolean;

  @Column()
  last_login_ip: string;
}
