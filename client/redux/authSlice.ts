import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { User } from "../pages/login/types";

export interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const { actions, reducer } = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<User | null>) {
      localStorage.setItem("jwtToken", action.payload?.token || "");
      state.user = action.payload;
    },
    setUserInfo(state, action) {
      state.user = action.payload;
    },
    logout(state) {
      localStorage.removeItem("jwtToken");
      state.user = null;
    },
  },
});

export const { login, logout, setUserInfo } = actions;

export default reducer;
