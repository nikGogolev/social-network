import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../features/auth/authSlice';
import errorSlice from '../features/error/errorSlice';
import userSlice from '../features/user/userSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    error: errorSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
