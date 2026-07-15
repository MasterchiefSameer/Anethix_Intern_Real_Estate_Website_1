import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true; // make loading true
    },
    signInSuccess: (state, action) => { // action is the data we get it
      state.currentUser = action.payload; // the data we get
      state.loading = false; // make loading false
      state.error = null; // make error null
    },
    signInFailure: (state, action) => { // action is the data we get it
      state.error = action.payload; // the error we get
      state.loading = false; // make loading false
    },
    
  },
});

export const { signInStart, signInSuccess, signInFailure } = userSlice.actions; // use this function in other places

export default userSlice.reducer; //use this reducer in store.js