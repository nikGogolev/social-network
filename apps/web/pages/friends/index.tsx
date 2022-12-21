import {
  checkFriendRequestStatus,
  findFriends,
  findRequests,
  getUsersByIds,
  updateFriendRequest,
} from '../../api/api';
import { useEffect, useState } from 'react';
import Header from '../../components/header';
import { MyNavbar } from '../../components/navbar';
// import styles from './index.module.scss';
import { useSelector } from 'react-redux';
import { getUserInfo, userInfoHandler } from '../../features/user/userSlice';
import { useAppDispatch } from '../../hooks/hooks';
import { checkAuthHandler } from '../../features/auth/authSlice';
import { FRIEND_REQUEST_STATUS, STATUSES } from 'common/constants';
import { UserInterface } from 'common/interfaces/UserInterface';
import FriendCard from '../../components/friend-card/friend-card';
import { Button } from '@material-tailwind/react';

/* eslint-disable-next-line */
export interface FriendsProps {}

export function Friends(props: FriendsProps) {
  const myUser = useSelector(getUserInfo);
  const [myApprovedFriends, setMyApprovedFriends] = useState<UserInterface[]>(
    []
  );
  const [myFriendRequests, setMyFriendRequests] = useState<UserInterface[]>([]);
  const dispatch = useAppDispatch();

  const checkAuthAndGetUserInfo = async () => {
    interface AuthResp {
      status: number;
      id?: string;
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

  const approveFriendRequest = async (userId) => {
    try {
      const updRes = await updateFriendRequest(
        userId,
        myUser.id,
        FRIEND_REQUEST_STATUS.approved
      );
      if (updRes.status === STATUSES.SUCCESS) {
        await getFriends();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const declineFriendRequest = async (userId) => {
    try {
      const updRes = await updateFriendRequest(
        userId,
        myUser.id,
        FRIEND_REQUEST_STATUS.declined
      );
      if (updRes.status === STATUSES.SUCCESS) {
        await getFriends();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const removeFromFriends = async (userId) => {
    try {
      const checkMeYouRes = await checkFriendRequestStatus(myUser.id, userId);
      if (checkMeYouRes.status === STATUSES.SUCCESS) {
        await updateFriendRequest(
          myUser.id,
          userId,
          FRIEND_REQUEST_STATUS.unfriended
        );
        await getFriends();
      }
      const checkYouMeRes = await checkFriendRequestStatus(userId, myUser.id);
      if (checkYouMeRes.status === STATUSES.SUCCESS) {
        await updateFriendRequest(
          userId,
          myUser.id,
          FRIEND_REQUEST_STATUS.unfriended
        );
        await getFriends();
      }
    } catch (error) {
      console.log('error', error.message);
    }
  };

  useEffect(() => {
    checkAuthAndGetUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const getFriends = async () => {
    try {
      if (myUser.id) {
        const reqRes = await findRequests(myUser.id);
        if (reqRes.status === STATUSES.SUCCESS) {
          const requests = reqRes.payload.reduce((prev, curr) => {
            if (curr.status === FRIEND_REQUEST_STATUS.requested) {
              return prev.concat(curr.initiatorId);
            } else {
              return prev;
            }
          }, []);

          if (requests.length) {
            const requestsRes = await getUsersByIds(requests);
            setMyFriendRequests(requestsRes.payload);
          } else {
            setMyFriendRequests([]);
          }
        } else {
          setMyFriendRequests([]);
        }
        const friendsRes = await findFriends(myUser.id);
        console.log(friendsRes);

        if (friendsRes.status === STATUSES.SUCCESS) {
          const approves = friendsRes.payload.reduce((prev, curr) => {
            if (curr.status === FRIEND_REQUEST_STATUS.approved) {
              return prev.concat(
                curr.initiatorId !== myUser.id
                  ? curr.initiatorId
                  : curr.targetId
              );
            } else return prev;
          }, []);

          if (approves.length) {
            const approvesRes = await getUsersByIds(approves);
            setMyApprovedFriends(approvesRes.payload);
          } else {
            setMyApprovedFriends([]);
          }
        } else {
          setMyApprovedFriends([]);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myUser.id]);

  return (
    <>
      <Header />
      <div className="flex flex-row justify-between mt-2">
        <MyNavbar />
        <div className="flex flex-col w-full">
          {myFriendRequests.length ? (
            <div className="ml-2 mb-4 p-4 divide-y-2 flex flex-col grow items-start rounded-xl shadow-md backdrop-saturate-200 backdrop-blur-2xl bg-opacity-80 border border-white/80 bg-white">
              <p className="mb-4 text-lg">
                Your friend requests
                <span className="text-gray-500 text-lg ml-2">
                  {myFriendRequests.length}
                </span>
              </p>
              {myFriendRequests.map((item) => (
                <div key={item.id} className="flex items-center w-full">
                  <FriendCard user={item} />
                  <div
                    className="flex flex-col ml-2
            "
                  >
                    <Button
                      size="sm"
                      className="bg-teal-500 mb-2"
                      onClick={() => approveFriendRequest(item.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-200"
                      onClick={() => declineFriendRequest(item.id)}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            ''
          )}
          {myApprovedFriends.length ? (
            <div className="ml-2 p-4 flex flex-col divide-y-2 grow items-start rounded-xl shadow-md backdrop-saturate-200 backdrop-blur-2xl bg-opacity-80 border border-white/80 bg-white">
              <p className="mb-4 text-lg">
                Your friends
                <span className="text-gray-500 text-lg ml-2">
                  {myApprovedFriends.length}
                </span>
              </p>
              {myApprovedFriends.map((item) => (
                <div key={item.id} className="flex items-center w-full">
                  <FriendCard user={item} />
                  <div
                    className="flex flex-col ml-2
            "
                  >
                    <Button
                      size="sm"
                      className="bg-red-200"
                      onClick={() => removeFromFriends(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>You havent friends yet</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Friends;
