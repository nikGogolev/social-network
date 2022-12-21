export class SignupUserDto {
  firstName: string;
  lastName: string;
  email: string;
  pwdHash: string;
}

export class SignupProfileDto {
  country: string;
  hometown: string;
  gender: string;
  birthdate: string;
  file: string;
}
