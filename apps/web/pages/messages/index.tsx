import MyPopup from '../../components/my-popup/my-popup';
import { AuthInterface } from 'common/interfaces/AuthInterface';
import Header from '../../components/header';
import { MyNavbar } from '../../components/navbar';
import { useAppDispatch } from '../../hooks/hooks';
import { useSelector } from 'react-redux';
import { getError } from '../../features/error/errorSlice';
// import styles from './index.module.scss';

export interface MessagesProps {
  auth?: AuthInterface;
}

export function Messages(props) {
  const dispatch = useAppDispatch();
  const error = useSelector(getError);

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
