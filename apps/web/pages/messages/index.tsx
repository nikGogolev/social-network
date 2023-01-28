import MyPopup from '../../components/my-popup/my-popup';
import { AuthInterface } from 'common/interfaces/AuthInterface';
import Header from '../../components/header';
import { MyNavbar } from '../../components/navbar';
import { useAppDispatch } from '../../hooks/hooks';
import { useSelector } from 'react-redux';
import { getError } from '../../features/error/errorSlice';
import { useEffect } from 'react';
import { findMessages } from '../../api/api';
import { MessageInterface } from 'common/interfaces/MessageInterface';
// import styles from './index.module.scss';

export interface MessagesProps {
  auth?: AuthInterface;
}

export function Messages(props: MessagesProps) {
  const dispatch = useAppDispatch();
  const error = useSelector(getError);
  useEffect(() => {
    (async () => {
      const response = await findMessages(props.auth?.user.id);
      const messages: MessageInterface[] = response.payload;
      console.log(messages);
      const sortedMessages = {};
      messages.forEach((item) => {
        switch (item.fromUserId) {
          case props.auth?.user.id:
            if (!sortedMessages[item.toUserId]) {
              sortedMessages[item.toUserId] = [item];
            } else {
              sortedMessages[item.toUserId].push(item);
            }
            break;

          default:
            if (!sortedMessages[item.fromUserId]) {
              sortedMessages[item.fromUserId] = [item];
            } else {
              sortedMessages[item.fromUserId].push(item);
            }
            break;
        }
      });
      console.log(sortedMessages);
    })();
  }, []);

  return (
    <>
      <Header {...props} />
      {error.isError && <MyPopup errorText={error.errorMessage} />}
      <div className="flex flex-row justify-between mt-2">
        <MyNavbar {...props} />
        <div className="ml-2 p-4 flex flex-col grow items-start rounded-xl shadow-md backdrop-saturate-200 backdrop-blur-2xl bg-opacity-80 border border-white/80 bg-white">
          <h1>Welcome to Messages!</h1>
        </div>
      </div>
    </>
  );
}

export default Messages;
