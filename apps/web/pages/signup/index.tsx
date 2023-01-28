import { useState } from 'react';
import crypto from 'crypto';
import styles from './index.module.scss';

import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { Button, Input, Option, Select } from '@material-tailwind/react';
import Header from '../../components/header';
import { useAppDispatch } from '../../hooks/hooks';
import {
  signupHandler,
  uploadPhotoHandler,
} from '../../features/auth/authSlice';
import { useRouter } from 'next/router';

import ReactCrop, { centerCrop, Crop, makeAspectCrop } from 'react-image-crop';
import loadImage from 'blueimp-load-image';
import Image from 'next/image';
import { AuthInterface } from 'common/interfaces/AuthInterface';
import MyPopup from '../../components/my-popup/my-popup';
import { useSelector } from 'react-redux';
import { getError, setError } from '../../features/error/errorSlice';

export interface SignupProps {
  auth?: AuthInterface;
}

function Signup(props: SignupProps) {
  const dispatch = useAppDispatch();
  const error = useSelector(getError);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [repeatPwd, setRepeatPwd] = useState('');
  const [country, setCountry] = useState('');
  const [hometown, setHomeTown] = useState('');
  const [gender, setGender] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [err, setErr] = useState('');
  const [photoUploadForm, setPhotoUploadForm] = useState(false);
  const [userId, setUserId] = useState(0);
  const [originWidth, setOriginWidth] = useState(0);
  const [originHeight, setOriginHeight] = useState(0);
  const [crop, setCrop] = useState<Crop>({
    unit: '%', // Can be 'px' or '%'
    x: 0,
    y: 0,
    width: 30,
    height: 40,
  });

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      pwd: '',
      repeatPwd: '',
      country: '',
      hometown: '',
      gender: '',
      birthdate: '',
    },
  });

  const getScaledImage = async () => {
    const img = document.getElementById('image') as HTMLImageElement;
    const scaledImage: HTMLCanvasElement = loadImage.scale(
      img, // img or canvas element
      {
        top: (originHeight * crop.y) / 100,
        left: (originWidth * crop.x) / 100,
        right: originWidth - (originWidth * (crop.width + crop.x)) / 100,
        bottom: originHeight - (originHeight * (crop.height + crop.y)) / 100,
        crop,
      }
    );

    return scaledImage;
  };

  const showPhoto = () => {
    const file = (document.getElementById('file') as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      // const photoContainer = document.getElementById('photoContainer');
      // const image = document.createElement('img');
      const image = document.getElementById('image');
      // image.setAttribute('id', 'image');
      image.setAttribute('src', e.target.result as string);
      // image.addEventListener('onLoad', (e) => onImageLoad(e));
      // photoContainer.appendChild(image);
    };
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;

    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 30,
        },
        3 / 4,
        width,
        height
      ),
      width,
      height
    );

    setCrop(crop);
  };

  const onCropChange = (crop, percentCrop) => setCrop(percentCrop);

  const onSubmit = async (data) => {
    const hash = crypto.createHash('sha256').update(data.pwd).digest('hex');

    try {
      setErr('');
      if (pwd === repeatPwd) {
        const sendData = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          pwdHash: hash,
        };

        const res = await dispatch(signupHandler(sendData));

        if (res.meta?.requestStatus === 'fulfilled') {
          setUserId(res.payload as number);
          setPhotoUploadForm(true);
          // setFirstName('');
          // setLastName('');
          // setEmail('');
          // setPwd('');
          // setRepeatPwd('');
          // setErr('');
        }

        if (res.meta?.requestStatus === 'rejected') {
          setErr(res.payload as string);
          dispatch(setError(res.payload as string));
        }
      } else {
        setErr('Passwords dont match');
      }
    } catch (error) {
      dispatch(setError(error.message));
      setErr(error.message);
    }
  };

  const onSubmitPhoto = async (data) => {
    const formdata = new FormData();

    try {
      const scaledImage = await getScaledImage();
      scaledImage.toBlob(async (blob: Blob) => {
        const newFile = new File([blob], 'temp.jpg', blob);

        setErr('');
        formdata.append('country', country);
        formdata.append('hometown', hometown);
        formdata.append('gender', gender);
        formdata.append('birthdate', birthdate);
        formdata.append('file', newFile);
        const res = await dispatch(
          uploadPhotoHandler({ photo: formdata, userId })
        );

        if (res.meta?.requestStatus === 'fulfilled') {
          router.push(`users/${userId}`);
        }

        if (res.meta?.requestStatus === 'rejected') {
          dispatch(setError(res.payload as string));
          setErr(res.payload as string);
        }
      });
    } catch (error) {
      dispatch(setError(error.message));
      setErr(error.message);
    }
  };

  return (
    <>
      <Header {...props} />
      {error.isError && <MyPopup errorText={error.errorMessage} />}
      <div className={styles.container}>
        {photoUploadForm ? (
          <form onSubmit={handleSubmit(onSubmitPhoto)} className={styles.form}>
            <h1>New user</h1>
            <p>Please, upload your photo</p>
            <div id="photo">
              <ReactCrop
                crop={crop}
                onChange={(c, p) => {
                  onCropChange(c, p);
                }}
                maxWidth={300}
                maxHeight={300}
                minHeight={100}
                minWidth={100}
                aspect={3 / 4}
              >
                <div id="photoContainer">
                  <Image src="" alt="" id="image" onLoad={onImageLoad} />
                </div>
              </ReactCrop>
            </div>
            <div className={styles.formItem}>
              <Input
                label="Photo"
                id="file"
                type="file"
                onInput={(e) => {
                  if (e.target instanceof HTMLInputElement) {
                    loadImage(e.target.files[0], function (img, data) {
                      setOriginWidth(data.originalWidth);
                      setOriginHeight(data.originalHeight);
                    });
                    showPhoto();
                  }
                }}
              />
              {err && <p className={styles.formError}>{err}</p>}
            </div>
            <div className={styles.formItem}>
              <Input
                label="Country"
                {...register('country')}
                value={country}
                onInput={(e) => {
                  if (e.target instanceof HTMLInputElement) {
                    setCountry(e.target.value);
                  }
                }}
              />
              <p className={styles.formError}>
                {errors.country?.message as string}
              </p>
            </div>
            <div className={styles.formItem}>
              <Input
                label="Hometown"
                {...register('hometown')}
                value={hometown}
                onInput={(e) => {
                  if (e.target instanceof HTMLInputElement) {
                    setHomeTown(e.target.value);
                  }
                }}
              />
              <p className={styles.formError}>
                {errors.hometown?.message as string}
              </p>
            </div>
            <div className={styles.formItem}>
              <Input
                type={'date'}
                label="Birthdate"
                {...register('birthdate')}
                value={birthdate}
                onInput={(e) => {
                  if (e.target instanceof HTMLInputElement) {
                    setBirthdate(e.target.value);
                  }
                }}
              />
              <p className={styles.formError}>
                {errors.birthdate?.message as string}
              </p>
            </div>
            <div className={styles.formItem}>
              <Select
                label="Gender"
                {...register('gender')}
                value={gender}
                onChange={(e) => {
                  setGender(e as string);
                }}
              >
                <Option value="F">F</Option>
                <Option value="M">M</Option>
              </Select>
              <p className={styles.formError}>
                {errors.firstName?.message as string}
              </p>
            </div>

            <Button
              size="lg"
              color="teal"
              ripple={true}
              onClick={handleSubmit(onSubmitPhoto)}
            >
              Submit
            </Button>
            <div>
              <span>Already have an account?</span>{' '}
              <Link href="/login">Login</Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <h1>New user</h1>
            <p>Please, input registration data</p>
            <div className={styles.formItem}>
              <Input
                label="First name"
                {...register('firstName', {
                  required: 'This is required',
                  minLength: {
                    value: 1,
                    message: 'Min length 1 symbol',
                  },
                })}
                value={firstName}
                onInput={(e) => {
                  if (e.target instanceof HTMLInputElement) {
                    setFirstName(e.target.value);
                  }
                }}
              />
              <p className={styles.formError}>
                {errors.firstName?.message as string}
              </p>
            </div>
            <div className={styles.formItem}>
              <Input
                label="Last name"
                {...register('lastName', {
                  required: 'This is required',
                  minLength: {
                    value: 1,
                    message: 'Min length 1 symbol',
                  },
                })}
                value={lastName}
                onInput={(e) => {
                  if (e.target instanceof HTMLInputElement) {
                    setLastName(e.target.value);
                  }
                }}
              />
              <p className={styles.formError}>
                {errors.lastName?.message as string}
              </p>
            </div>
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
                onInput={(e) => {
                  if (e.target instanceof HTMLInputElement) {
                    setEmail(e.target.value);
                  }
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
                onInput={(e) => {
                  if (e.target instanceof HTMLInputElement) {
                    setPwd(e.target.value);
                  }
                }}
              />
              <p className={styles.formError}>
                {errors.pwd?.message as string}
              </p>
            </div>
            <div className={styles.formItem}>
              <Input
                type={'password'}
                label="Repeat password"
                {...register('repeatPwd', {
                  required: 'This is required',
                  minLength: { value: 6, message: 'Min length 6 symbols' },
                })}
                value={repeatPwd}
                onInput={(e) => {
                  if (e.target instanceof HTMLInputElement) {
                    setRepeatPwd(e.target.value);
                  }
                }}
              />
              <p className={styles.formError}>
                {errors.repeatPwd?.message as string}
              </p>
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
              <span>Already have an account?</span>{' '}
              <Link href="/login">Login</Link>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

export default Signup;
