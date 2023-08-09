import { Column, Entity } from 'typeorm';
import { Request } from '../request.entity';

/*
 * NicRequest modal which maps to nic request. This will inherit from request
 */

@Entity()
export class NicRequest extends Request {
  @Column({ nullable: false, length: 128 })
  birthcert_no: string;

  @Column({ nullable: false, length: 1024 })
  birthcert_url: string;
}
