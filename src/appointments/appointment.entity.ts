import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Appointment')
export class Appointment {
  @PrimaryColumn()
  appointment_id: string;

  @Column({ nullable: false, length: 128 })
  first_name: string;

  @Column({ nullable: false, length: 128 })
  last_name: string;

  @Column({ nullable: false, length: 12 })
  NIC: string;

  @Column({ nullable: false, length: 128 })
  address: string;

  @Column({ nullable: false, length: 128 })
  contact_num: string;

  @Column({ nullable: false, length: 128 })
  email: string;

  @Column({ nullable: false, length: 10 })
  status: string;

  @Column({ nullable: true, length: 12 })
  reference_number: string;
}
