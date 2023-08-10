import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Request } from '../request.entity';

/*
 * NicRequest modal which maps to nic request. This will inherit from request
 */

@Entity('NIC_Request')
export class NicRequest {
  @PrimaryColumn()
  request_id: number;

  @OneToOne(() => Request, { cascade: true })
  @JoinColumn({ name: 'request_id' })
  request: Request;

  @Column({ nullable: false, length: 128 })
  birthcert_no: string;

  @Column({ nullable: false, length: 1024 })
  birthcert_url: string;
}
