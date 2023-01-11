import { STATUSES } from 'common/constants';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '../components/header';
import MyPopup from '../components/my-popup/my-popup';
import { checkAuthHandler } from '../features/auth/authSlice';
import { getError, setError } from '../features/error/errorSlice';
import { useAppDispatch } from '../hooks/hooks';
import styles from './index.module.scss';

export function Index({ auth }) {
  const dispatch = useAppDispatch();
  const error = useSelector(getError);
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
          dispatch(setError((res.payload as AuthResp).message));
          setErr((res.payload as AuthResp).message);
        }
      } catch (error) {
        dispatch(setError(error.message));
        setErr(error.message);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <>
      <Header auth={auth} />
      {error.isError && <MyPopup errorText={error.errorMessage} />}
      <div className={styles.container}>
        Loading...
        <Link href={'/users'}>to users</Link>
        {err && <p className={styles.formError}>{err}</p>}
      </div>
    </>
  );
}

export default Index;
