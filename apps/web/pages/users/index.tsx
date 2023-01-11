import Header from '../../components/header';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { UserInterface } from '../../../../common/interfaces/UserInterface';
import { AuthInterface } from 'common/interfaces/AuthInterface';
import MyPopup from '../../components/my-popup/my-popup';
import { useAppDispatch } from '../../hooks/hooks';
import { useSelector } from 'react-redux';
import { getError, setError } from '../../features/error/errorSlice';

export interface UserProps {
  auth?: AuthInterface;
}

export function Users(props: UserProps) {
  const dispatch = useAppDispatch();
  const error = useSelector(getError);
  const [users, setUsers] = useState([] as UserInterface[]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('http://localhost:3001/api/users', {
          method: 'GET',
          mode: 'cors',
          redirect: 'follow',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
        const data = await response.json();
        const users: UserInterface[] = data.response?.payload;

        setUsers(users);
      } catch (error) {
        dispatch(setError(error.message));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Header {...props} />
      {error.isError && <MyPopup errorText={error.errorMessage} />}
      {users ? (
        users.map((user) => (
          <div key={user.id}>
            <Link href={`users/${user.id}`}>
              User:
              <p>{user.firstName}</p>
              <p>{user.lastName}</p>
              <p>{user.id}</p>
              <p>{new Date(+user.createDate).toLocaleDateString()}</p>
            </Link>
          </div>
        ))
      ) : (
        <div>Nothing</div>
      )}
    </>
  );
}

export default Users;
