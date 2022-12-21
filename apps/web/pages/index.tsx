import { STATUSES } from 'common/constants';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '../components/header';
import { checkAuthHandler } from '../features/auth/authSlice';
import { userInfoHandler } from '../features/user/userSlice';
import { useAppDispatch } from '../hooks/hooks';
import styles from './index.module.scss';

export function Index() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [err, setErr] = useState('');
  interface AuthResp {
    status: number;
    id?: string;
    message?: string;
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await dispatch(checkAuthHandler());

        if ((res.payload as AuthResp).status === STATUSES.SUCCESS) {
          router.push(`users/${(res.payload as AuthResp).id}`);
        }

        if ((res.payload as AuthResp).status === STATUSES.NOT_AUTHORIZED) {
          router.push(`login`);
        }
        if ((res.payload as AuthResp).status === STATUSES.USER_NOT_EXIST) {
          router.push(`signup`);
        }

        if (res.meta?.requestStatus === 'rejected') {
          setErr((res.payload as AuthResp).message);
        }
      } catch (error) {
        setErr(error.message);
        console.log('error', error.message);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <>
      <Header />
      <div className={styles.container}>
        Loading...
        <Link href={'/users'}>to users</Link>
        {err && <p className={styles.formError}>{err}</p>}
      </div>
    </>
  );
}

export default Index;
