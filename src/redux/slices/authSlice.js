import { createSlice } from "@reduxjs/toolkit";

// Rehydrate a persisted session so a refresh doesn't bounce to /login.
const persisted =
  typeof window !== "undefined"
    ? window.localStorage.getItem("duo_admin")
    : null;

const initialState = {
  isAuthenticated: !!persisted,
  user: persisted ? JSON.parse(persisted) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("duo_admin", JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("duo_admin");
      }
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
