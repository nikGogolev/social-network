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
import { useSelector } from 'react-redux';
import { checkAuthHandler } from '../../features/auth/authSlice';
import { getUserInfo, userInfoHandler } from '../../features/user/userSlice';
import { useAppDispatch } from '../../hooks/hooks';
import { Button } from '@material-tailwind/react';
import {
  addToFriendsHandler,
  checkFriendRequestStatus,
  getUserInfoFromServer,
  updateFriendRequest,
} from '../../api/api';
import { UserInterface } from 'common/interfaces/UserInterface';

function User(props) {
  console.log('PAGE ID AUTH', props);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const myUser = useSelector(getUserInfo);
  const [user, setUser] = useState({} as UserInterface);
  const [myFriendRequestStatus, setMyFriendRequestStatus] = useState('');
  const [hisFriendRequestStatus, setHisFriendRequestStatus] = useState('');

  const checkAuthAndGetUserInfo = async () => {
    interface AuthResp {
      status: number;
      id?: number;
      message?: string;
    }
    try {
      const res = await dispatch(checkAuthHandler());
      if ((res.payload as AuthResp).status === STATUSES.SUCCESS) {
        await dispatch(userInfoHandler(+(res.payload as AuthResp).id));
      }
    } catch (error) {
      console.log('error', error.message);
    }
  };

  const addToFriends = async () => {
    try {
      const checkRes = await checkFriendRequestStatus(myUser.id, user.id);
      if (checkRes.status === STATUSES.SUCCESS) {
        const updRes = await updateFriendRequest(
          myUser.id,
          user.id,
          FRIEND_REQUEST_STATUS.requested
        );
        if (updRes.status === STATUSES.SUCCESS) {
          const checkMeYouRes = await checkFriendRequestStatus(
            myUser.id,
            user.id
          );
          if (checkMeYouRes.status === STATUSES.SUCCESS) {
            setMyFriendRequestStatus(
              (checkMeYouRes.payload as FriendRequestInterface).status
            );
          }
        }
      } else {
        const addRes = await addToFriendsHandler(myUser.id, user.id);
        if (addRes.status === STATUSES.SUCCESS) {
          const checkMeYouRes = await checkFriendRequestStatus(
            myUser.id,
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
      console.log('error', error.message);
    }
  };

  const confirmFriendRequest = async () => {
    try {
      const updRes = await updateFriendRequest(
        user.id,
        myUser.id,
        FRIEND_REQUEST_STATUS.approved
      );
      if (updRes.status === STATUSES.SUCCESS) {
        const checkMeYouRes = await checkFriendRequestStatus(
          myUser.id,
          user.id
        );
        if (checkMeYouRes.status === STATUSES.SUCCESS) {
          setMyFriendRequestStatus(
            (checkMeYouRes.payload as FriendRequestInterface).status
          );
        }
        const checkYouMeRes = await checkFriendRequestStatus(
          user.id,
          myUser.id
        );
        if (checkYouMeRes.status === STATUSES.SUCCESS) {
          setHisFriendRequestStatus(
            (checkYouMeRes.payload as FriendRequestInterface).status
          );
        }
      }
    } catch (error) {
      console.log('error', error.message);
    }
  };

  const declineFriendRequest = async () => {
    try {
      const updRes = await updateFriendRequest(
        user.id,
        myUser.id,
        FRIEND_REQUEST_STATUS.declined
      );
      if (updRes.status === STATUSES.SUCCESS) {
        const checkMeYouRes = await checkFriendRequestStatus(
          myUser.id,
          user.id
        );
        if (checkMeYouRes.status === STATUSES.SUCCESS) {
          setMyFriendRequestStatus(
            (checkMeYouRes.payload as FriendRequestInterface).status
          );
        }
        const checkYouMeRes = await checkFriendRequestStatus(
          user.id,
          myUser.id
        );
        if (checkYouMeRes.status === STATUSES.SUCCESS) {
          setHisFriendRequestStatus(
            (checkYouMeRes.payload as FriendRequestInterface).status
          );
        }
      }
    } catch (error) {
      console.log('error', error.message);
    }
  };

  const removeFromFriends = async () => {
    try {
      const checkMeYouRes = await checkFriendRequestStatus(myUser.id, user.id);
      if (checkMeYouRes.status === STATUSES.SUCCESS) {
        await updateFriendRequest(
          myUser.id,
          user.id,
          FRIEND_REQUEST_STATUS.unfriended
        );
      }
      const checkYouMeRes = await checkFriendRequestStatus(user.id, myUser.id);
      if (checkYouMeRes.status === STATUSES.SUCCESS) {
        await updateFriendRequest(
          user.id,
          myUser.id,
          FRIEND_REQUEST_STATUS.unfriended
        );
      }
    } catch (error) {
      console.log('error', error.message);
    }
  };

  const friendStatus = useMemo(() => {
    if (user.id === myUser.id) {
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
  }, [myFriendRequestStatus, hisFriendRequestStatus, user.id, myUser.id]);

  useEffect(() => {
    setMyFriendRequestStatus('');
    setHisFriendRequestStatus('');
    if (myUser.id && user.id) {
      checkFriendRequestStatus(myUser.id, user.id)
        .then((res) => {
          if (res.status === STATUSES.SUCCESS) {
            setMyFriendRequestStatus(
              (res.payload as FriendRequestInterface).status
            );
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
      checkFriendRequestStatus(user.id, myUser.id)
        .then((res) => {
          if (res.status === STATUSES.SUCCESS) {
            setHisFriendRequestStatus(
              (res.payload as FriendRequestInterface).status
            );
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id, myUser]);

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
        console.log(error.message);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id]);

  useEffect(() => {
    checkAuthAndGetUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <>
      <Header />
      <div className="flex flex-row justify-between mt-2">
        <MyNavbar />
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

// User.getInitialProps = async (ctx) => {
//   console.log(ctx);
//   return { auth: true };
// };
export default User;
