import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/*
 * AppUser which maps to appuser table in the database
 * * This is an abstract which should be inherited
 */

@Entity('App_User')
export class AppUser {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ nullable: false, length: 64 })
  first_name: string;

  @Column({ nullable: false, length: 64 })
  last_name: string;

  @Column({ nullable: false, length: 64 })
  email: string;

  @Column({ nullable: false, length: 32 })
  civil_status: string;

  @Column({ nullable: false, length: 10 })
  phone_number: string;

  @Column({ nullable: false, length: 64 })
  birth_place: string;

  @Column({ nullable: false, length: 64 })
  occupation: string;

  @Column({ nullable: false, length: 8 })
  sex: string;

  @Column({ nullable: false })
  dob: Date;

  @Column({ nullable: false })
  postal_code: number;

  @Column({ nullable: false, length: 128 })
  permenant_address: string;
}
