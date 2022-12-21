import { Navbar, Typography } from '@material-tailwind/react';
import { getUserInfo } from '../../features/user/userSlice';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { findRequests } from '../../api/api';
import { FRIEND_REQUEST_STATUS, STATUSES } from 'common/constants';
// import styles from './navbar.module.scss';

/* eslint-disable-next-line */
export interface MyNavbarProps {}

export function MyNavbar(props: MyNavbarProps) {
  const myUser = useSelector(getUserInfo);
  const [friendRequests, setFriendRequests] = useState(0);
  const navLinks = {
    main: { icon: '', name: 'My page', link: '/', counter: 0 },
    messages: { icon: '', name: 'Messages', link: '/messages', counter: 0 },
    friends: {
      icon: '',
      name: 'Friends',
      link: '/friends',
      counter: friendRequests,
    },
    photos: { icon: '', name: 'Photos', link: '/photos', counter: 0 },
  };
  const getFriends = async () => {
    if (myUser.id) {
      const friendsRes = await findRequests(myUser.id);
      if (friendsRes.status === STATUSES.SUCCESS) {
        const requests = friendsRes.payload.reduce((prev, curr) => {
          if (curr.status === FRIEND_REQUEST_STATUS.requested) {
            return prev.concat(curr.initiatorId);
          } else {
            return prev;
          }
        }, []);
        setFriendRequests(requests.length);
      }
    }
  };

  useEffect(() => {
    getFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myUser.id]);
  const navList = (
    <ul className="mb-4 mt-2 flex flex-col items-stretch gap-2 mb-0 mt-0 items-center gap-4 w-28 ">
      {Object.values(navLinks).map((item) => (
        <Typography
          key={item.link}
          as="li"
          variant="small"
          color="teal"
          className="p-2 font-normal hover:bg-teal-100 rounded-md"
        >
          <Link
            href={`${item.link}`}
            className="flex items-center justify-between"
          >
            <span>{`${item.name}`}</span>
            {item.counter > 0 && <span>{item.counter}</span>}
          </Link>
        </Typography>
      ))}
    </ul>
  );

  return <nav className="">{navList}</nav>;
}

export default Navbar;
