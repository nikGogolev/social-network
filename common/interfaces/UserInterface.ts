export interface UserInterface {
  owner?: boolean;
  firstName: string;
  lastName: string;
  id?: number;
  createDate: number;
  email: string;
  pwdHash?: string;
  token?: string;
  profile?: {
    photo?: string;
    country?: string;
    hometown?: string;
    gender?: string;
    birthdate?: string;
    userId?: string;
  };
}
