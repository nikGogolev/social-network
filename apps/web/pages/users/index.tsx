import Header from '../../components/header';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { UserInterface } from '../../../../common/interfaces/UserInterface';
// import { useSelector } from 'react-redux';
// import { getAuthState } from '../../features/auth/authSlice';

export function Users() {
  const [users, setUsers] = useState([] as UserInterface[]);
  // const isAuth = useSelector(getAuthState);

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
            //'Access-Control-Allow-Origin': 'http://localhost:4200',
          },
        });
        const user: UserInterface[] = await response.json();
        setUsers(user);
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, []);
  return (
    <>
      <Header />
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
