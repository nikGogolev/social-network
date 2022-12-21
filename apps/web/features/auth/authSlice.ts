import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { checkAuth, login, logout, signup, uploadPhoto } from '../../api/api';
import { STATUSES } from 'common/constants';
import { RootState } from '../../store/store';

interface AuthState {
  isAuth: boolean;
  id: number;
}

const initialState: AuthState = {
  isAuth: false,
  id: 0,
};

export const checkAuthHandler = createAsyncThunk(
  'auth/checkAuthHandler',
  async (_, { dispatch, rejectWithValue, fulfillWithValue }) => {
    try {
      const response = await checkAuth();

      if (!response.error && response.status === STATUSES.SUCCESS) {
        dispatch(setAuth({ isAuth: true, id: response.payload.id }));

        return fulfillWithValue({
          status: STATUSES.SUCCESS,
          id: response.payload.id,
        });
      }
      if (response.status === STATUSES.USER_NOT_EXIST) {
        dispatch(setAuth({ isAuth: false, id: null }));
        return rejectWithValue({
          status: STATUSES.USER_NOT_EXIST,
          message: response.message,
        });
      }

      if (response.status === STATUSES.NOT_AUTHORIZED) {
        dispatch(setAuth({ isAuth: false, id: null }));
        return rejectWithValue({
          status: STATUSES.NOT_AUTHORIZED,
          message: response.message,
        });
      }

      if (response.error) {
        dispatch(setAuth({ isAuth: false, id: null }));
        return rejectWithValue({
          status: STATUSES.INTERNAL_ERROR,
          message: response.error,
        });
      }
    } catch (error) {
      dispatch(setAuth({ isAuth: false, id: null }));
      return rejectWithValue({
        status: STATUSES.INTERNAL_ERROR,
        message: error.message,
      });
    }
  }
);

export const logoutHandler = createAsyncThunk(
  'auth/logoutHandler',
  async (_, { dispatch, fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await logout();
      if (!response.error && response.status === STATUSES.SUCCESS) {
        dispatch(setAuth({ isAuth: false, id: null }));
      } else {
        return rejectWithValue(response.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

interface LoginData {
  email: string;
  pwdHash: string;
}

interface loginResponse {
  status: number;
  payload?: {
    userId: number;
  };
  error?: string;
}

export const loginHandler = createAsyncThunk(
  'auth/loginHandler',
  async (
    loginData: LoginData,
    { dispatch, rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const response: loginResponse = await login(loginData);
      if (!response.error && response.status === STATUSES.SUCCESS) {
        dispatch(setAuth({ isAuth: true, id: response.payload.userId }));
        return fulfillWithValue(response.payload.userId);
      }

      if (!response.error && response.status === STATUSES.PASSWORD_ERROR) {
        return rejectWithValue('Wrong password');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  pwdHash: string;
}

interface SignupResponse {
  status: number;
  payload?: {
    userId: number;
  };
  error?: string;
}

export const signupHandler = createAsyncThunk(
  'auth/signupHandler',
  async (
    signupData: SignupData,
    { dispatch, rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const response: SignupResponse = await signup(signupData);
      if (!response.error && response.status === STATUSES.SUCCESS) {
        dispatch(setAuth({ isAuth: true, id: response.payload.userId }));
        return fulfillWithValue(response.payload.userId);
      }

      if (!response.error && response.status === STATUSES.USER_EXIST) {
        return rejectWithValue('User exist');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

interface UploadPhoto {
  photo: FormData;
  userId: number;
}

export const uploadPhotoHandler = createAsyncThunk(
  'auth/uoloadPhotoHandler',
  async (
    formData: UploadPhoto,
    { dispatch, rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const response: SignupResponse = await uploadPhoto(
        formData.photo,
        formData.userId
      );
      if (!response.error && response.status === STATUSES.SUCCESS) {
        return fulfillWithValue(response.payload);
      }

      if (!response.error && response.status === STATUSES.USER_EXIST) {
        return rejectWithValue('User exist');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, { payload }) => {
      state.isAuth = payload.isAuth;
      state.id = payload.id;
    },
  },
});

export const { setAuth } = authSlice.actions;
export const getAuthState = (state: RootState): AuthState => {
  return state.auth;
};
export default authSlice.reducer;
