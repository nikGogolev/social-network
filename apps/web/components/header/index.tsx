import {
  Button,
  IconButton,
  MobileNav,
  Typography,
} from '@material-tailwind/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Logout from '../logout';
import { AuthInterface } from 'common/interfaces/AuthInterface';
// import styles from './index.module.scss';

export interface HeaderProps {
  auth?: AuthInterface;
}

export function Header(props: HeaderProps) {
  const [openNav, setOpenNav] = useState(false);

  useEffect(() => {
    window.addEventListener(
      'resize',
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const authButtons = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 sm:mb-0 sm:mt-0 sm:flex-row sm:items-center items-center sm:gap-6">
      {!props.auth?.isAuthenticated && (
        <Typography as="li" variant="small" className="p-1 font-normal">
          <Button
            variant="gradient"
            size="sm"
            className="sm:inline-block items-center"
            color="teal"
          >
            <Link href="/login" className="flex items-center">
              Login
            </Link>
          </Button>
        </Typography>
      )}
      {props.auth?.isAuthenticated && (
        <Typography as="li" variant="small" className="p-1 font-normal">
          <Logout />
        </Typography>
      )}
    </ul>
  );

  return (
    <div className="container rounded-xl py-4 px-8 shadow-md backdrop-saturate-200 backdrop-blur-2xl bg-opacity-80 border border-white/80 bg-white">
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        <Typography
          as="div"
          variant="small"
          className="mr-4 cursor-pointer py-1.5 font-normal"
        >
          <Link href="/" className="flex items-center relative">
            <span className="absolute text-2xl text-center w-8 h-8 text-blue-gray-100 bg-teal-500 rounded-full">
              S
            </span>
            <span className="absolute text-2xl text-center w-8 h-8 left-6 absolute text-2xl text-blue-gray-100 bg-teal-500 rounded-full">
              N
            </span>
          </Link>
        </Typography>
        <div className="hidden sm:block"></div>
        <div className="hidden sm:block">{authButtons}</div>

        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent sm:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </IconButton>
      </div>
      <MobileNav open={openNav}>{authButtons}</MobileNav>
    </div>
  );
}

export default Header;
