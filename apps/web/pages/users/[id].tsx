import Header from '../../components/header';
import {
  FRIEND_REQUEST_STATUS,
  PROFILE_PHOTO_WIDTH,
  STATUSES,
} from 'common/constants';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { FriendRequestInterface } from '../../../../common/interfaces/FriendRequestInterface';
import Image from 'next/image';
import styles from './index.module.scss';
import { MyNavbar } from '../../components/navbar';
import { Button } from '@material-tailwind/react';
import {
  addToFriendsHandler,
  checkFriendRequestStatus,
  getUserInfoFromServer,
  updateFriendRequest,
} from '../../api/api';
import { UserInterface } from 'common/interfaces/UserInterface';
import { AuthInterface } from 'common/interfaces/AuthInterface';
import MyPopup from '../../components/my-popup/my-popup';
import { useAppDispatch } from '../../hooks/hooks';
import { useSelector } from 'react-redux';
import { getError, setError } from '../../features/error/errorSlice';

export interface UsersProps {
  auth?: AuthInterface;
}

function User(props: UsersProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const error = useSelector(getError);
  const [user, setUser] = useState({} as UserInterface);
  const [myFriendRequestStatus, setMyFriendRequestStatus] = useState('');
  const [hisFriendRequestStatus, setHisFriendRequestStatus] = useState('');

  const addToFriends = async () => {
    try {
      const checkRes = await checkFriendRequestStatus(
        props.auth.user.id,
        user.id
      );
      if (checkRes.status === STATUSES.SUCCESS) {
        const updRes = await updateFriendRequest(
          props.auth.user.id,
          user.id,
          FRIEND_REQUEST_STATUS.requested
        );
        if (updRes.status === STATUSES.SUCCESS) {
          const checkMeYouRes = await checkFriendRequestStatus(
            props.auth.user.id,
            user.id
          );
          if (checkMeYouRes.status === STATUSES.SUCCESS) {
            setMyFriendRequestStatus(
              (checkMeYouRes.payload as FriendRequestInterface).status
            );
          }
        }
      } else {
        const addRes = await addToFriendsHandler(props.auth.user.id, user.id);
        if (addRes.status === STATUSES.SUCCESS) {
          const checkMeYouRes = await checkFriendRequestStatus(
            props.auth.user.id,
            user.id
          );
          if (checkMeYouRes.status === STATUSES.SUCCESS) {
            setMyFriendRequestStatus(
              (checkMeYouRes.payload as FriendRequestInterface).status
            );
          }
        }
      }
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  const confirmFriendRequest = async () => {
    try {
      const updRes = await updateFriendRequest(
        user.id,
        props.auth.user.id,
        FRIEND_REQUEST_STATUS.approved
      );
      if (updRes.status === STATUSES.SUCCESS) {
        const checkMeYouRes = await checkFriendRequestStatus(
          props.auth.user.id,
          user.id
        );
        if (checkMeYouRes.status === STATUSES.SUCCESS) {
          setMyFriendRequestStatus(
            (checkMeYouRes.payload as FriendRequestInterface).status
          );
        }
        const checkYouMeRes = await checkFriendRequestStatus(
          user.id,
          props.auth.user.id
        );
        if (checkYouMeRes.status === STATUSES.SUCCESS) {
          setHisFriendRequestStatus(
            (checkYouMeRes.payload as FriendRequestInterface).status
          );
        }
      }
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  const declineFriendRequest = async () => {
    try {
      const updRes = await updateFriendRequest(
        user.id,
        props.auth.user.id,
        FRIEND_REQUEST_STATUS.declined
      );
      if (updRes.status === STATUSES.SUCCESS) {
        const checkMeYouRes = await checkFriendRequestStatus(
          props.auth.user.id,
          user.id
        );
        if (checkMeYouRes.status === STATUSES.SUCCESS) {
          setMyFriendRequestStatus(
            (checkMeYouRes.payload as FriendRequestInterface).status
          );
        }
        const checkYouMeRes = await checkFriendRequestStatus(
          user.id,
          props.auth.user.id
        );
        if (checkYouMeRes.status === STATUSES.SUCCESS) {
          setHisFriendRequestStatus(
            (checkYouMeRes.payload as FriendRequestInterface).status
          );
        }
      }
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  const removeFromFriends = async () => {
    try {
      const checkMeYouRes = await checkFriendRequestStatus(
        props.auth.user.id,
        user.id
      );
      if (checkMeYouRes.status === STATUSES.SUCCESS) {
        await updateFriendRequest(
          props.auth.user.id,
          user.id,
          FRIEND_REQUEST_STATUS.unfriended
        );
      }
      const checkYouMeRes = await checkFriendRequestStatus(
        user.id,
        props.auth.user.id
      );
      if (checkYouMeRes.status === STATUSES.SUCCESS) {
        await updateFriendRequest(
          user.id,
          props.auth?.user?.id,
          FRIEND_REQUEST_STATUS.unfriended
        );
      }
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  const friendStatus = useMemo(() => {
    if (user.id === props.auth?.user?.id) {
      return <></>;
    } else if (
      (myFriendRequestStatus === FRIEND_REQUEST_STATUS.unfriended ||
        myFriendRequestStatus === FRIEND_REQUEST_STATUS.none ||
        myFriendRequestStatus === FRIEND_REQUEST_STATUS.declined) &&
      (hisFriendRequestStatus === FRIEND_REQUEST_STATUS.none ||
        hisFriendRequestStatus === FRIEND_REQUEST_STATUS.unfriended ||
        hisFriendRequestStatus === FRIEND_REQUEST_STATUS.declined)
    ) {
      return (
        <Button color="teal" onClick={addToFriends}>
          Add to friends
        </Button>
      );
    } else if (
      myFriendRequestStatus === FRIEND_REQUEST_STATUS.approved ||
      hisFriendRequestStatus === FRIEND_REQUEST_STATUS.approved
    ) {
      return (
        <>
          <p className="text-gray-500">{user.firstName} your friend</p>
          <Button className="bg-red-200" onClick={removeFromFriends}>
            Remove from friends
          </Button>
        </>
      );
    } else if (
      hisFriendRequestStatus &&
      hisFriendRequestStatus === FRIEND_REQUEST_STATUS.requested
    ) {
      return (
        <>
          <p className="text-gray-500">
            {user.firstName} wants to add you to friends
          </p>
          <Button
            size="sm"
            className="bg-teal-500 mb-2"
            onClick={confirmFriendRequest}
          >
            Confirm
          </Button>
          <Button
            size="sm"
            className="bg-red-200"
            onClick={declineFriendRequest}
          >
            Decline
          </Button>
        </>
      );
    } else if (myFriendRequestStatus === FRIEND_REQUEST_STATUS.requested) {
      return <p className="text-gray-500">You are send friend request</p>;
    } else {
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    myFriendRequestStatus,
    hisFriendRequestStatus,
    user.id,
    props.auth?.user?.id,
  ]);

  useEffect(() => {
    setMyFriendRequestStatus('');
    setHisFriendRequestStatus('');
    if (props.auth?.user?.id && user.id) {
      checkFriendRequestStatus(props.auth.user.id, user.id)
        .then((res) => {
          if (res.status === STATUSES.SUCCESS) {
            setMyFriendRequestStatus(
              (res.payload as FriendRequestInterface).status
            );
          }
        })
        .catch((error) => {
          dispatch(setError(error.message));
        });
      checkFriendRequestStatus(user.id, props.auth.user.id)
        .then((res) => {
          if (res.status === STATUSES.SUCCESS) {
            setHisFriendRequestStatus(
              (res.payload as FriendRequestInterface).status
            );
          }
        })
        .catch((error) => {
          dispatch(setError(error.message));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id, props.auth?.user]);

  useEffect(() => {
    (async () => {
      try {
        if (router.query.id) {
          const res = await getUserInfoFromServer(router.query.id);
          if (res.status === STATUSES.SUCCESS) {
            setUser(res.payload);
          }
        }
      } catch (error) {
        dispatch(setError(error.message));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id]);

  return (
    <>
      <Header {...props} />
      {error.isError && <MyPopup errorText={error.errorMessage} />}
      <div className="flex flex-row justify-between mt-2">
        <MyNavbar {...props} />
        <div className="ml-2 p-4 flex flex-col grow items-start rounded-xl shadow-md backdrop-saturate-200 backdrop-blur-2xl bg-opacity-80 border border-white/80 bg-white">
          <h1 className={styles['profile-description-header']}>
            {user.firstName} {user.lastName}
          </h1>
          <div className="flex flex-row gap-4 w-full">
            {user?.profile?.photo && (
              <Image
                priority={true}
                className={styles.profilePhoto}
                loader={() => user?.profile?.photo}
                src={user?.profile?.photo}
                alt="user photo"
                width={PROFILE_PHOTO_WIDTH}
                height={(PROFILE_PHOTO_WIDTH * 4) / 3}
              />
            )}
            <div className="grow">
              <p>
                <span className={styles['profile-description-span']}>
                  Country:{' '}
                </span>
                {user.profile?.country}
              </p>
              <p>
                <span className={styles['profile-description-span']}>
                  Hometown:{' '}
                </span>
                {user.profile?.hometown}
              </p>
              <p>
                <span className={styles['profile-description-span']}>
                  Gender:{' '}
                </span>
                {user.profile?.gender}
              </p>
              <p>
                <span className={styles['profile-description-span']}>
                  Birth date:{' '}
                </span>
                {user.profile?.birthdate}
              </p>
            </div>
            <div className="flex flex-col items-end">{friendStatus}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default User;
