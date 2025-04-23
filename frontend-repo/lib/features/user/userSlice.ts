import { PayloadAction } from "@reduxjs/toolkit";
import { fetchUser, fetchUsers, updateUser } from "@/apis/user";
import { createAppSlice } from "@/lib/appSlice";
import { UpdateUserPayload, User } from "@repo/entities/user";

interface UserSliceState {
  updateUserStatus?: "idle" | "loading" | "failed";
  user?: User;
  userStatus: "idle" | "loading" | "failed";
  users?: User[];
  usersStatus: "idle" | "loading" | "failed";
}

const initialState: UserSliceState = {
  updateUserStatus: "idle",
  userStatus: "idle",
  usersStatus: "idle",
};

const userSlice = createAppSlice({
  name: "user",
  initialState,
  reducers: (create) => ({
    setUserStatus: create.reducer(
      (state, action: PayloadAction<"idle" | "loading" | "failed">) => {
        state.userStatus = action.payload;
      }
    ),
    setUsersStatus: create.reducer(
      (state, action: PayloadAction<"idle" | "loading" | "failed">) => {
        state.usersStatus = action.payload;
      }
    ),
    setUpdateUserStatus: create.reducer(
      (state, action: PayloadAction<"idle" | "loading" | "failed">) => {
        state.updateUserStatus = action.payload;
      }
    ),
    // setUpdateUserPayload: create.reducer(
    //   (state, action: PayloadAction<UpdateUserPayload>) => {
    //     state.updateUserPayload = action.payload;
    //   }
    // ),
    fetchUsersAsync: create.asyncThunk(
      async () => {
        const response = await fetchUsers();
        return response.data;
      },
      {
        pending: (state) => {
          state.usersStatus = "loading";
        },
        fulfilled: (state, action) => {
          state.usersStatus = "idle";
          state.users = action.payload;
        },
        rejected: (state) => {
          state.usersStatus = "failed";
        },
      }
    ),
    fetchUserAsync: create.asyncThunk(
      async (uid: string) => {
        const response = await fetchUser(uid);
        return response.data;
      },
      {
        pending: (state) => {
          state.userStatus = "loading";
        },
        fulfilled: (state, action) => {
          state.userStatus = "idle";
          state.user = action.payload;

          /*let data = {};
          const payload = action.payload as Record<string, any>;
          Object.keys(payload).map((item) => {
            data = { ...data, [item]: payload[item] };
          });
          state.updateUserPayload = data as UpdateUserPayload;*/
        },
        rejected: (state) => {
          state.userStatus = "failed";
        },
      }
    ),
    updateUserAsync: create.asyncThunk(
      async (payload: UpdateUserPayload) => {
        const response = await updateUser(payload);
        return response.data;
      },
      {
        pending: (state) => {
          state.updateUserStatus = "loading";
        },
        fulfilled: (state) => {
          state.updateUserStatus = "idle";
          // state.updateUserPayload = initialState.updateUserPayload;
        },
        rejected: (state) => {
          state.updateUserStatus = "failed";
        },
      }
    ),
  }),
  selectors: {
    // updateUserPayload: (user) => user.updateUserPayload,
    updateUserStatus: (user) => user.updateUserStatus,
    user: (user) => user.user,
    userStatus: (user) => user.userStatus,
    users: (user) => user.users,
    usersStatus: (user) => user.usersStatus,
  },
});

const {
  setUserStatus,
  setUsersStatus,
  setUpdateUserStatus,
  // setUpdateUserPayload,
  fetchUsersAsync,
  fetchUserAsync,
  updateUserAsync,
} = userSlice.actions;
const { users, usersStatus, user, userStatus } = userSlice.selectors;

export type { UserSliceState };

export {
  userSlice,
  setUserStatus,
  setUsersStatus,
  setUpdateUserStatus,
  // setUpdateUserPayload,
  fetchUsersAsync,
  fetchUserAsync,
  updateUserAsync,
  // updateUserPayload,
  users,
  usersStatus,
  user,
  userStatus,
};
