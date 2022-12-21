import Header from '../../components/header';
import { MyNavbar } from '../../components/navbar';
import styles from './index.module.scss';

/* eslint-disable-next-line */
export interface PhotosProps {}

export function Photos(props: PhotosProps) {
  return (
    <>
      <Header />
      <div className="flex flex-row justify-between mt-2">
        <MyNavbar />
        <div className="ml-2 p-4 flex flex-col grow items-start rounded-xl shadow-md backdrop-saturate-200 backdrop-blur-2xl bg-opacity-80 border border-white/80 bg-white">
          <h1>Welcome to Photos!</h1>
        </div>
      </div>
    </>
  );
}

export default Photos;
