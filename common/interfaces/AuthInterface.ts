import { UserInterface } from './UserInterface';

export interface AuthInterface {
  user: UserInterface;
  isAuthenticated: boolean;
}
