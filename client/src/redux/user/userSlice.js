import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null, // Becomes an object containing user details (username, email, avatar, etc.) when logged in
  error: null, // Stores any sign-in error messages if authentication fails
  loading: false, // A boolean tracking if a login request is currently pending
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