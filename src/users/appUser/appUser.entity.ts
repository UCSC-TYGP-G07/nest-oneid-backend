import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { AuthUser } from '../authUser/authUser.entity';

export enum CivilStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  WIDOWED = 'widowed',
  SEPARATED = 'separated',
  DIVORCED = 'divorced',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

/*
 * AppUser entity which maps to App_User table in the database
 */

@Entity('App_User')
export class AppUser {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @OneToOne(() => AuthUser)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  authUser: AuthUser;

  // AppUser-specific attributes
  @Column({ name: 'first_name', nullable: false, length: 64 })
  firstName: string;

  @Column({ name: 'last_name', nullable: false, length: 64 })
  lastName: string;

  @Column({ name: 'email', nullable: false, length: 64 })
  email: string;

  @Column({ name: 'civil_status', type: 'enum', enum: CivilStatus, nullable: false })
  civilStatus: CivilStatus;

  @Column({ name: 'phone_number', nullable: false, length: 10 })
  phoneNumber: string;

  @Column({ name: 'birth_place', nullable: false, length: 64 })
  birthPlace: string;

  @Column({ name: 'occupation', nullable: false, length: 64 })
  occupation: string;

  @Column({ name: 'gender', type: 'enum', enum: Gender, nullable: false })
  gender: Gender;

  @Column({ name: 'dob', nullable: true })
  dob: Date;

  @Column({ name: 'postal_code', nullable: false })
  postalCode: string;

  @Column({ name: 'permanent_address', nullable: false, length: 128 })
  permanentAddress: string;
}
