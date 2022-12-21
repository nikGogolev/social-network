import { PROFILE_PHOTO_WIDTH } from 'common/constants';
import { UserInterface } from 'common/interfaces/UserInterface';
import Image from 'next/image';
import styles from './friend-card.module.scss';
import Link from 'next/link';

/* eslint-disable-next-line */
export interface FriendCardProps {
  user: UserInterface;
}

export function FriendCard(props: FriendCardProps) {
  return (
    <>
      <div className="ml-2 mb-2 p-2 w-full flex flex-col grow items-start bg-white">
        <Link href={`/users/${props.user.id}`}>
          <div className="flex flex-row items-center gap-4 w-full">
            <Image
              priority={false}
              className={styles.img + ' rounded-full object-cover'}
              loader={() => props.user.profile?.photo}
              src={props.user?.profile?.photo}
              alt="user photo"
              width={PROFILE_PHOTO_WIDTH / 2}
              height={PROFILE_PHOTO_WIDTH / 2}
              style={{ height: PROFILE_PHOTO_WIDTH / 2 }}
            />
            <div className="">
              <p>{props.user.firstName}</p>
              <p>{props.user.lastName}</p>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}

export default FriendCard;
