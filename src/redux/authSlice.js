import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";

// Thunk for login
export const login = createAsyncThunk(
  "authentication/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Attempt to log in with Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;  // Return the logged-in user data
    } catch (error) {
        console.log(error);
      // If an error occurs, return a rejected value to be handled in the reducer
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
    "authentication/logout",
    async () => {
      try {
        // Attempt to log out with Firebase authentication
       const r = await signOut(auth);
       console.log(r)
       return null;
       
      } catch (error) {
        // If an error occurs, return a rejected value to be handled in the reducer
        
      }
    }
  );

const INITIAL_STATE = {
  user: null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: "authentication",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle login request started
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;  // Clear any previous error
      })
      // Handle login success
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;  // Store the user data
        state.loading = false;
      })
      // Handle login error
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;  // Store the error message
      })
      // Handle logout request started
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;  // Clear any previous error
      })
      // Handle logout success
      .addCase(logout.fulfilled, (state, action) => {
        state.user = null;  // Store the user data
        state.loading = false;
      })
      // Handle logout error
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;  // Store the error message
      })
  },
});

export default authSlice.reducer;

// Selectors
export const selectUser = (state) => state.authentication.user;
export const selectLoading = (state) => state.authentication.loading;
export const selectError = (state) => state.authentication.error;
