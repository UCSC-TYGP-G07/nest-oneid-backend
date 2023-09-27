import { CivilStatus, Gender } from './appUser.entity';

export class AppUserCreateDTO {
  firstName: string;
  lastName: string;
  email: string;
  civilStatus: CivilStatus;
  phoneNumber: string;
  birthPlace: string;
  occupation: string;
  gender: Gender;
  dob: string;
  postalCode: string;
  permanentAddress: string;
}
