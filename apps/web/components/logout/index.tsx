import { Button } from '@material-tailwind/react';
import { logoutHandler } from '../../features/auth/authSlice';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';

/* eslint-disable-next-line */
export interface LogoutProps {}

export function Logout(props: LogoutProps) {
  const router = useRouter();

  const dispatch = useDispatch();

  const logout = async () => {
    dispatch(logoutHandler() as unknown as AnyAction);
    router.push('/login');
  };
  return (
    <Button
      variant="gradient"
      size="sm"
      className="sm:inline-block"
      color="teal"
      onClick={logout}
    >
      <span>Logout</span>
    </Button>
  );
}

export default Logout;
