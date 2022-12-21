import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUserInfoFromServer } from '../../api/api';
import { STATUSES } from 'common/constants';
import { UserInterface } from 'common/interfaces/UserInterface';
import { RootState } from '../../store/store';

const initialState: UserInterface = {
  firstName: '',
  lastName: '',
  createDate: 0,
  email: '',
  profile: { photo: '' },
};

interface serverResponse {
  status: number;
  payload?: Record<string, unknown>;
  error?: string;
}

export const userInfoHandler = createAsyncThunk(
  'user/getUserInfo',
  async (id: number, { dispatch, rejectWithValue, fulfillWithValue }) => {
    try {
      const response: serverResponse = await getUserInfoFromServer(id);
      if (!response.error && response.status === STATUSES.SUCCESS) {
        dispatch(setUser(response.payload));
        return fulfillWithValue(response.payload);
      }

      if (!response.error && response.status === STATUSES.INTERNAL_ERROR) {
        return rejectWithValue('Internal server error');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.email = payload.email;
      state.createDate = payload.createDate;
      state.firstName = payload.firstName;
      state.id = payload.id;
      state.lastName = payload.lastName;
      state.profile = payload.profile;
      state.owner = payload.owner;
    },
  },
});

export const getUserInfo = (state: RootState): UserInterface => {
  return state.user;
};
export const { setUser } = userSlice.actions;
export default userSlice.reducer;
