import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AppUser } from '../users/appUser/appUser.entity';

/*
 * Request modal which maps to request table
 * * This is an abstract which should be inherited
 */

@Entity('PID_Request')
export abstract class Request {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  request_id: string;

  @Column({ nullable: false })
  pid_type: string;

  @Column({ nullable: false })
  req_date: Date;

  @Column({ nullable: false })
  req_status: string;

  @OneToOne(() => AppUser, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  appUser: AppUser;
}
