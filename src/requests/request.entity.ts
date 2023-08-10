import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AppUser } from '../users/appUser.entity';

/*
 * Request modal which maps to request table
 * * This is an abstract which should be inherited
 */

@Entity()
export abstract class Request {
  @PrimaryGeneratedColumn()
  request_id: number;

  @Column({ nullable: false })
  pid_type: string;

  @Column({ nullable: false })
  req_date: Date;

  @Column({ nullable: false })
  req_status: string;

  @OneToOne(() => AppUser)
  @JoinColumn()
  appUser: AppUser;
}