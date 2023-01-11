import { resetError } from 'apps/web/features/error/errorSlice';
import { useAppDispatch } from 'apps/web/hooks/hooks';
import styles from './my-popup.module.scss';

/* eslint-disable-next-line */
export interface MyPopupProps {
  errorText: string;
}

export function MyPopup(props: MyPopupProps) {
  const dispatch = useAppDispatch();
  const clickHandler = () => {
    dispatch(resetError());
  };
  return (
    <div className={styles['container']}>
      <div className={styles['modal_backdrop']}>
        <div className={styles.modal}>
          <header className={styles['modal_header']}>Error!</header>
          <div className={styles['modal_text']}>{props.errorText}</div>
          <button type="button" onClick={clickHandler}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyPopup;
