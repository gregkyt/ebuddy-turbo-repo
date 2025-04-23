import { PayloadAction } from "@reduxjs/toolkit";
import { signIn } from "@/apis/auth";
import { User } from "firebase/auth";
import { createAppSlice } from "@/lib/appSlice";
import { SignInPayload, SignInResponse } from "@/apis/entitites/auth";
import { setCookie } from "cookies-next";
import { Cookies } from "@/constants/constant";

interface AuthSliceState {
  signInPayload: SignInPayload;
  signInUser?: User;
  signInStatus: "idle" | "loading" | "failed";
}

const initialState: AuthSliceState = {
  signInPayload: { email: "", password: "" },
  signInStatus: "idle",
};

const authSlice = createAppSlice({
  name: "auth",
  initialState,
  reducers: (create) => ({
    setSignInPayload: create.reducer(
      (state, action: PayloadAction<SignInPayload>) => {
        state.signInPayload = action.payload;
      }
    ),
    setStatus: create.reducer(
      (state, action: PayloadAction<"idle" | "loading" | "failed">) => {
        state.signInStatus = action.payload;
      }
    ),
    signInAsync: create.asyncThunk(
      async (payload: SignInPayload) => {
        const response = await signIn(payload.email, payload.password);
        const accessToken = await response.user.getIdToken();
        const result: SignInResponse = {
          user: response.user,
          accessToken: accessToken,
        };
        setCookie(Cookies.accessToken, accessToken);
        return result;
      },
      {
        pending: (state) => {
          state.signInStatus = "loading";
        },
        fulfilled: (state, action) => {
          state.signInStatus = "idle";
          state.signInUser = action.payload.user;
        },
        rejected: (state) => {
          state.signInStatus = "failed";
        },
      }
    ),
  }),
  selectors: {
    signInPayload: (auth) => auth.signInPayload,
    signInUser: (auth) => auth.signInUser,
    signInStatus: (auth) => auth.signInStatus,
  },
});

const { setSignInPayload, setStatus, signInAsync } = authSlice.actions;
const { signInPayload, signInUser, signInStatus } = authSlice.selectors;

export type { SignInPayload, AuthSliceState };

export {
  authSlice,
  setSignInPayload,
  setStatus,
  signInAsync,
  signInPayload,
  signInUser,
  signInStatus,
};
