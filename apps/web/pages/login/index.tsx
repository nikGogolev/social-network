import { useState } from 'react';
import crypto from 'crypto';
import styles from './index.module.scss';

import { useForm } from 'react-hook-form';
import Link from 'next/link';

import { useRouter } from 'next/router';
import { Button, Input } from '@material-tailwind/react';
import { loginHandler } from '../../features/auth/authSlice';
import { useAppDispatch } from '../../hooks/hooks';
import Header from '../../components/header';

function Login() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');

  const router = useRouter();

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      pwd: '',
    },
  });

  const dispatch = useAppDispatch();

  const onSubmit = async (data) => {
    const hash = crypto.createHash('sha256').update(data.pwd).digest('hex');
    try {
      setErr('');
      const res = await dispatch(
        loginHandler({
          email: data.email,
          pwdHash: hash,
        })
      );

      if (res.meta?.requestStatus === 'fulfilled') {
        router.push(`users/${res.payload}`);
        setEmail('');
      }

      if (res.meta?.requestStatus === 'rejected') {
        setErr(res.payload as string);
        setPwd('');
      }
    } catch (error) {
      setErr(error.message);
    }
  };
  return (
    <>
      <Header />
      <div className={styles.container}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <h1>Login</h1>
          <p>Please, input your registration data</p>
          <div className={styles.formItem}>
            <Input
              label="Email"
              {...register('email', {
                required: 'This is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i,
                  message: 'Wrong email',
                },
              })}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <p className={styles.formError}>
              {errors.email?.message as string}
            </p>
          </div>
          <div className={styles.formItem}>
            <Input
              type={'password'}
              label="Password"
              {...register('pwd', {
                required: 'This is required',
                minLength: { value: 6, message: 'Min length 6 symbols' },
              })}
              value={pwd}
              onChange={(e) => {
                setPwd(e.target.value);
              }}
            />
            <p className={styles.formError}>{errors.pwd?.message as string}</p>
            {err && <p className={styles.formError}>{err}</p>}
          </div>
          <Button
            size="lg"
            color="teal"
            ripple={true}
            onClick={handleSubmit(onSubmit)}
          >
            Submit
          </Button>
          <div>
            <span>Have not account yet?</span>{' '}
            <Link href="/signup">Signup</Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
