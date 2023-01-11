import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';

const initialState = {
  isError: false,
  errorMessage: '',
};

export const userSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError: (state, { payload }) => {
      console.log(payload);

      state.isError = true;
      state.errorMessage = payload;
    },
    resetError: (state) => {
      state.isError = false;
      state.errorMessage = '';
    },
  },
});

export const getError = (state: RootState) => {
  return state.error;
};
export const { setError, resetError } = userSlice.actions;
export default userSlice.reducer;
